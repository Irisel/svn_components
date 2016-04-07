var tpl_map = {
    show: false,
    contains: [],
    detail: {
        isloading: true
    },
    components: {
        search_links: [{
            name: '所有配件',
            param: 'all'
        },{
            name: '空闲中',
            param: 'free'
        },{
            name: '待领取',
            param: 'awaits'
        },
        ,{
            name: '已领取',
            param: 'taken'
        }
        ],
        search_inputs: [
            {
                tds: [
                    {
                        type: 'select',
                        label: '配件类型',
                        name: 'type',
                        val: '',
                        options:[
                            {
                                val: 'normal',
                                name: '普通'
                            },
                            {
                                val: 'consumable',
                                name: '消耗品'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        label: '配件归属',
                        name: 'zone'
                    },{

                    }
                ]
            },
            {
                tds: [
                    {
                        type: 'select',
                        label: '配件状态',
                        name: 'status',
                        val: '',
                        options:[
                            {
                                val: 'provide',
                                name: '领用'
                            },
                            {
                                val: 'rent',
                                name: '租用'
                            },
                            {
                                val: 'free',
                                name: '空闲'
                            }
                        ]
                    },
                    {
                        type: 'radio',
                        label: '配件用途',
                        name: 'use_for',
                        radios: [
                        {
                            val: 'provide',
                            text: '借用',
                            name: 'use_for'
                        },
                        {
                            val: 'rent',
                            text: '领用',
                            name: 'use_for'
                        },
                        {
                            val: '',
                            text: '不限',
                            name: 'use_for'
                        }
                    ]
                    },{

                    }
                ]
            }
        ],
        params: {
            all: true,
            free: false,
            awaits: false,
            taken: false,
            type: '',
            use_for: '',
            zone: '',
            status: 'free',
            name: ''
        },
        search_log: '空闲',
        list: []
    },
    orders: {
        search_links: [{
            name: '所有订单',
            param: 'all'
        },{
            name: '待领取',
            param: 'awaits'
        },{
            name: '已领取',
            param: 'taken'
        },
        ,{
            name: '已归还',
            param: 'return'
        }
        ],
        search_inputs:[],
        params: {
            all: true
        },
        list: []
    },
    users: {
        search_links: [{
            name: '所有用户',
            param: 'all'
        }
        ],
        search_inputs:[],
        params: {
            all: true
        },
        list: []
    }
};
export default function tpl(state, action){
    var tpl = {};
    for(let i in tpl_map){
        if(tpl_map.hasOwnProperty(i))tpl[i] = tpl_map[i]
    }
    if(action.type=='show_form'){
        tpl.show = action.method?action.method.show:false;
    }
    if(action.type=='APPEND_CONTAIN'){
        if(action.contain)tpl.contains.push(action.contain);
    }
    if(action.type=='POP_CONTAIN'){
        tpl.contains =[];
    }
    if(action.type=='filter_update'){
        if(action.model && action.param){
            for(let key in tpl[action.model]['params']){
                if((tpl[action.model]['params'][key]===false || tpl[action.model]['params'][key]===true) && (action.param.value===false || action.param.value===true))tpl[action.model]['params'][key] = false;
            }
            tpl[action.model]['params'][action.param.key] =  action.param.value;
        }
    }
    if(action.type=='LOADING_DETAIL'){
        tpl.detail.isloading = true;
    }
    if(action.type=='LOADING_LIST'){
        if(action.method)tpl[action.method].isloading = true;
    }
    if(action.type=='REFRESH_LIST'){
        if(action.method && action.get){
            tpl[action.method].list = action.get.data;
            tpl[action.method].isloading = false;
        }
    }
    if(action.type=='REFRESH_DETAIL'){
        if(action.get){
            tpl.detail = action.get.data;
            tpl.detail.isloading = false;
        }
    }
    tpl_map = tpl;
    return tpl
}
