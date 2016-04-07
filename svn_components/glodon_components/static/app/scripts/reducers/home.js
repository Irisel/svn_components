var store_map = {
    user: {
            isAdmin: undefined,
            info: [

            ]
        },
    model: '',
    home: {
        links:[

        ],
        dl: [

        ]
    },
    components:{
        dl: [

        ]
    },
    users:{
        dl: [

        ]
    },
    orders:{
        dl: [

        ]
    },
    list_urls: {
        components: '/project/components_list',
        orders: '/project/orders_list',
        users: '/project/users_list'
    }
};
export default function store_user(state, action){
    var admin_store = {
        user: {
                isAdmin: false,
                info: [

                ]
        },
        zones: [],
        model: '',
        home: {
            links:[
                    {
                        hash: '/app/components',
                        glyphicon: 'glyphicon-cog',
                        name: '配件中心'
                    },
                    {
                        hash: '/app/orders',
                        glyphicon: 'glyphicon-align-justify',
                        name: '订单中心'
                    },
                    {
                        hash: '/app/users',
                        glyphicon: 'glyphicon-user',
                        name: '用户中心'
                    }
            ],
            dl: [
                {
                    type: 'dt',
                    txt: '客户服务',
                    glyphicon:'glyphicon-heart'
                },
                {
                    type: 'dd',
                    txt: '租用配件',
                    hash: '/app/home/rent'
                },
                {
                    type: 'dd',
                    txt: '领用配件',
                    hash: '/app/home/provide'
                },
                {
                    type: 'dd',
                    txt: '归还配件',
                    hash: '/app/home/return'
                }
            ]
        },
        components: {
            dl: [
                {
                    type: 'dt',
                    txt: '配件管理'
                },
                {
                    type: 'dd',
                    txt: '浏览配件',
                    hash: '/app/components/list'
                },{
                    type: 'dd',
                    txt: '添加配件',
                    hash: '/app/components/add'
                },
                {
                    type: 'dt',
                    txt: '客户服务',
                    glyphicon:'glyphicon-heart'
                },
                {
                    type: 'dd',
                    txt: '租用配件',
                    hash: '/app/components/rent'
                },
                {
                    type: 'dd',
                    txt: '领用配件',
                    hash: '/app/components/provide'
                },
                {
                    type: 'dd',
                    txt: '归还配件',
                    hash: '/app/components/return'
                }
            ]
        },
        orders: {
            dl: [
                {
                    type: 'dt',
                    txt: '订单管理'
                },
                {
                    type: 'dd',
                    txt: '浏览订单',
                    hash: '/app/orders/list'
                },
                {
                    type: 'dt',
                    txt: '客户服务',
                    glyphicon:'glyphicon-heart'
                },
                {
                    type: 'dd',
                    txt: '租用配件',
                    hash: '/app/orders/rent'
                },
                {
                    type: 'dd',
                    txt: '领用配件',
                    hash: '/app/orders/provide'
                },
                {
                    type: 'dd',
                    txt: '归还配件',
                    hash: '/app/orders/return'
                }
            ]
        },
        users: {
            dl: [
                {
                    type: 'dt',
                    txt: '用户管理'
                },
                {
                    type: 'dd',
                    txt: '浏览用户',
                    hash: '/app/users/list'
                },
                {
                    type: 'dt',
                    txt: '客户服务',
                    glyphicon:'glyphicon-heart'
                },
                {
                    type: 'dd',
                    txt: '租用配件',
                    hash: '/app/orders/rent'
                },
                {
                    type: 'dd',
                    txt: '领用配件',
                    hash: '/app/home/provide'
                },
                {
                    type: 'dd',
                    txt: '归还配件',
                    hash: '/app/home/return'
                }
            ]
        }
    };
    var normal_store = {
        user: {
                isAdmin: false,
                info: [

                ]
        },
        zones: [],
        model: '',
        home: {
            links:[
                    {
                        hash: '/app/components',
                        glyphicon: 'glyphicon-cog',
                        name: '配件中心'
                    },
                    {
                        hash: '/app/orders',
                        glyphicon: 'glyphicon-align-justify',
                        name: '订单中心'
                    }
            ],
            dl: [

            ]
        },
        components: {
            dl: [
                {
                    type: 'dt',
                    txt: '配件管理'
                },
                {
                    type: 'dd',
                    txt: '浏览配件',
                    hash: '/app/components/list'
                }
            ]
        },
        orders: {
            dl: [
                {
                    type: 'dt',
                    txt: '订单管理'
                },
                {
                    type: 'dd',
                    txt: '浏览订单',
                    hash: '/app/orders/list'
                }
            ]
        },
        users: {
            dl: [
            ]
        }
    };
    var store = {};
    for(let i in store_map){
        if(store_map.hasOwnProperty(i))store[i] = store_map[i]
    }
    function pack_store(role){
        switch(role){
            case 'admin':
                store.home = admin_store.home;
                store.components = admin_store.components;
                store.orders = admin_store.orders;
                store.users = admin_store.users;
                break;
            default:
                store.home = normal_store.home;
                store.components = normal_store.components;
                store.orders = normal_store.orders;
                store.users = normal_store.users;
                break;
        }
    }
    if(action.type=='UPDATE_MODEL'){
        if(action.model)store.model = action.model;
    }
    if(action.type=='SET_ZONES'){
        if(action.zones)store.zones = action.zones;
    }
    if(action.type=='RECEIVE_POSTS'){
        switch(action.method){
            case 'USER_INIT':
                store.user.user_id = action.posts.user_id;
                store.user.info = action.posts.info;
                store.user.isAdmin = action.posts.isAdmin;
                store.user.superAdmin = action.posts.superAdmin;
                var role = store.user.isAdmin?'admin': 'user';
                pack_store(role);
                break;
            default:
                break;
        }
    }
    store_map = store;
    return store
}
