export function provide_inputs(){
    return [
        {
            name: 'username',
            placeholder: '',
            label: '员工域账号',
            val: '',
            invalid: false,
            invalid_msg: '',
            focus: false,
            type: 'text'
        },
        {
            name: 'provide_range',
            placeholder: '',
            label: '领用时间',
            val: '',
            invalid: false,
            invalid_msg: '',
            type: 'datepicker'
        },
        {
            name: 'count',
            placeholder: '',
            label: '领用个数',
            required: true,
            val: '',
            invalid: false,
            invalid_msg: '',
            focus: false,
            type: 'number'
        }
    ];
}

export function  rent_inputs(){
    return [
        {
            name: 'username',
            placeholder: '',
            label: '员工域账号',
            val: '',
            invalid: false,
            invalid_msg: '',
            focus: false,
            type: 'text'
        },
        {
            name: 'rent_range',
            placeholder: '',
            label: '租用周期',
            val: '',
            invalid: false,
            invalid_msg: '',
            type: 'rangepicker'
        },
        {
            name: 'count',
            placeholder: '',
            label: '租用个数',
            val: '',
            required: true,
            invalid: false,
            invalid_msg: '',
            focus: false,
            type: 'number'
        }
    ];
}

export function  return_inputs (){
    return [
        {
            name: 'username',
            placeholder: '',
            label: '员工域账号',
            val: '',
            invalid: false,
            invalid_msg: '',
            focus: false,
            type: 'text'
        },
        {
            name: 'is_broken',
            label: '配件质量',
            type: 'radio',
            val: false,
            radios: [
                {
                    checked: true,
                    val: false,
                    text: '正常'
                },
                {
                    checked: false,
                    val: true,
                    text: '损坏'
                }
            ]
        },
        {
            name: 'count',
            placeholder: '',
            label: '归还个数',
            required: true,
            val: '1',
            default: '1',
            invalid: false,
            disabled: true,
            invalid_msg: '',
            focus: false,
            type: 'number'
        }
    ];
}


export function  update_user_inputs (){
    return [
        {
            type: 'select',
            label: '权限',
            name: 'permission_name',
            val: '',
            default: '',
            options:[
                {
                    val: 'normal_user',
                    name: '普通用户'
                },
                {
                    val: 'normal_admin',
                    name: '管理员'
                },
                {
                    val: 'super_admin',
                    name: '超级管理员'
                }
            ]
        }
    ];
}
