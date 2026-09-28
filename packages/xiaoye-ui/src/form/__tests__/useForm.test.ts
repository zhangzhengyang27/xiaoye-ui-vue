import { describe, it, expect, vi } from 'vitest';
import { nextTick, reactive, ref } from 'vue';
import useForm from '../useForm';

const flush = async () => {
  await nextTick();
  await Promise.resolve();
  await nextTick();
};

describe('Form.useForm', () => {
  it('必填项为空时 validate() 以 errorFields 拒绝，并带上规则的 message', async () => {
    const modelRef = reactive({ name: '', region: '' });
    const rulesRef = reactive({
      name: [{ required: true, message: '请输入名称' }],
      region: [{ required: true, message: '请选择区域' }],
    });
    const { validate } = useForm(modelRef, rulesRef);

    await expect(validate()).rejects.toEqual(
      expect.objectContaining({
        errorFields: [
          expect.objectContaining({ name: 'name', errors: ['请输入名称'] }),
          expect.objectContaining({ name: 'region', errors: ['请选择区域'] }),
        ],
      }),
    );
  });

  it('填好后 validate() 通过并返回被校验的字段值', async () => {
    const modelRef = reactive({ name: 'xiaoye' });
    const rulesRef = reactive({ name: [{ required: true, message: '请输入名称' }] });
    const { validate } = useForm(modelRef, rulesRef);

    await expect(validate()).resolves.toEqual({ name: 'xiaoye' });
  });

  it('校验结果写入 validateInfos，成功后状态回到 success', async () => {
    const modelRef = reactive({ name: '' });
    const rulesRef = reactive({ name: [{ required: true, message: '请输入名称' }] });
    const { validate, validateInfos } = useForm(modelRef, rulesRef);

    await validate().catch(() => null);
    await flush();
    expect(validateInfos.name.validateStatus).toBe('error');
    expect(validateInfos.name.help).toEqual([['请输入名称']]);

    modelRef.name = '填上了';
    await validate().catch(() => null);
    await flush();
    expect(validateInfos.name.validateStatus).toBe('success');
    expect(validateInfos.name.help).toBeNull();
  });

  it('只校验点名的字段，其它字段不会被写入错误状态', async () => {
    const modelRef = reactive({ a: '', b: '' });
    const rulesRef = reactive({
      a: [{ required: true, message: 'a 必填' }],
      b: [{ required: true, message: 'b 必填' }],
    });
    const { validate, validateInfos } = useForm(modelRef, rulesRef);

    await validate('a').catch(() => null);
    await flush();
    expect(validateInfos.a.validateStatus).toBe('error');
    expect(validateInfos.b.validateStatus).toBeUndefined();
  });

  it('按 trigger 过滤规则：显式传 trigger 时才只跑匹配的规则', async () => {
    const onBlurRule = vi.fn(() => Promise.reject(new Error('blur 报错')));
    const onChangeRule = vi.fn(() => Promise.reject(new Error('change 报错')));
    const modelRef = reactive({ name: '已有值' });
    const rulesRef = reactive({
      name: [
        { validator: onBlurRule, trigger: 'blur' },
        { validator: onChangeRule, trigger: 'change' },
      ],
    });
    const { validate } = useForm(modelRef, rulesRef);

    await validate(undefined, { trigger: 'blur' }).catch(() => null);
    await flush();
    expect(onBlurRule).toHaveBeenCalledTimes(1);
    expect(onChangeRule).not.toHaveBeenCalled();

    await validate(undefined, { trigger: 'change' }).catch(() => null);
    await flush();
    expect(onChangeRule).toHaveBeenCalledTimes(1);
    expect(onBlurRule).toHaveBeenCalledTimes(1);
  });

  it('validateFirst 命中第一条失败规则即停止', async () => {
    const secondRule = vi.fn(() => Promise.reject(new Error('第二条')));
    const modelRef = reactive({ name: '' });
    const rulesRef = reactive({
      name: [
        { required: true, message: '第一条' },
        { validator: secondRule, trigger: 'change' },
      ],
    });
    const { validate } = useForm(modelRef, rulesRef);

    await expect(validate(undefined, { validateFirst: true })).rejects.toEqual(
      expect.objectContaining({
        errorFields: [expect.objectContaining({ errors: ['第一条'] })],
      }),
    );
    await flush();
    expect(secondRule).not.toHaveBeenCalled();
  });

  it('resetFields() 把模型恢复到初始值', async () => {
    const modelRef = reactive({ name: '初始' });
    const rulesRef = reactive({ name: [{ required: true }] });
    const { resetFields } = useForm(modelRef, rulesRef);

    modelRef.name = '改过了';
    resetFields();
    await flush();
    expect(modelRef.name).toBe('初始');
  });

  it('resetFields(overrides) 在恢复初始值后套用新值', async () => {
    const modelRef = reactive({ name: '初始', age: 1 });
    const rulesRef = reactive({ name: [{ required: true }] });
    const { resetFields } = useForm(modelRef, rulesRef);

    modelRef.name = '改过了';
    resetFields({ age: 2 });
    await flush();
    expect(modelRef.name).toBe('初始');
    expect(modelRef.age).toBe(2);
  });

  it('clearValidate() 清掉状态但保留 required 标记', async () => {
    const modelRef = reactive({ name: '' });
    const rulesRef = reactive({ name: [{ required: true, message: '请输入名称' }] });
    const { validate, clearValidate, validateInfos } = useForm(modelRef, rulesRef);

    await validate().catch(() => null);
    await flush();
    expect(validateInfos.name.validateStatus).toBe('error');

    clearValidate();
    expect(validateInfos.name.validateStatus).toBe('');
    expect(validateInfos.name.help).toBeNull();
    expect(validateInfos.name.required).toBe(true);
  });

  it('immediate 选项让首次挂载即校验一次', async () => {
    const modelRef = reactive({ name: '' });
    const rulesRef = reactive({ name: [{ required: true, message: '请输入名称' }] });
    const onValidate = vi.fn();
    useForm(modelRef, rulesRef, { immediate: true, onValidate });
    await vi.waitFor(() => expect(onValidate).toHaveBeenCalledWith('name', false, ['请输入名称']));
  });

  it('model 变化会按 change 触发自动校验', async () => {
    const modelRef = reactive({ name: 'ok' });
    const rulesRef = reactive({ name: [{ required: true, message: '请输入名称' }] });
    const { validateInfos } = useForm(modelRef, rulesRef);

    modelRef.name = '';
    await vi.waitFor(() => expect(validateInfos.name.validateStatus).toBe('error'));
  });

  it('支持 ref 模型与嵌套路径 name', async () => {
    const modelRef = ref({ user: { name: '' } });
    const rulesRef = reactive({ 'user.name': [{ required: true, message: '请输入姓名' }] });
    const { validate, validateInfos } = useForm(modelRef, rulesRef);

    await validate().catch(() => null);
    await flush();
    expect(validateInfos['user.name'].validateStatus).toBe('error');
  });

  it('mergeValidateInfo 合并多个字段状态，任一 error 即整体 error', () => {
    const modelRef = reactive({ a: '', b: '' });
    const { mergeValidateInfo } = useForm(modelRef);

    expect(
      mergeValidateInfo([
        { validateStatus: 'success', required: false },
        { validateStatus: 'error', required: true, help: ['字段 b 出错'] },
      ]),
    ).toEqual(
      expect.objectContaining({
        autoLink: false,
        validateStatus: 'error',
        required: true,
        help: [['字段 b 出错']],
      }),
    );
  });
});
