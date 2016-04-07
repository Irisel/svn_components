# -*- coding: utf-8 -*-
import logging
from django.http import HttpResponse
import json
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.views.decorators.csrf import csrf_exempt
from glodon_components.dashboard.common.decorator import require_auth
from glodon_components.dashboard.common.hrutils import get_employee_data, location_map, status_map, order_map, \
    permission_map, usefor_map, type_map
from glodon_components.api import keystone, accessory
import requests
import time
from xml.dom import minidom
LOG = logging.getLogger(__name__)
REDIRECT_FIELD_NAME = '/login'


def index(request):
    return HttpResponseRedirect('/app')


@require_auth()
def home(request):
    template_name = 'horizon/app/index.html'
    return TemplateResponse(request, template_name, {})


@csrf_exempt
def login(request):
    template_name = 'horizon/app/login.html'
    return TemplateResponse(request, template_name, {})


@csrf_exempt
def logout(request):
    if request.session.get('username'):
        del request.session['username']
    if request.session.get('permission'):
        del request.session['permission']
    if request.session.get('user_id'):
        del request.session['user_id']
    request.session.set_expiry(0)
    template_name = 'horizon/app/login.html'
    return TemplateResponse(request, template_name, {})


def signin(request):
    status = {
        'success': False,
        'msg': '认证失败!'
    }
    if request.method == 'POST':
        try:
            fetch_post = json.loads(request.raw_post_data)
            form_data = fetch_post.get('form') or {}
            sign_in = """<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sso="http://www.glodon.com/xsd/SsoAuthUser"><soapenv:Header/>
                                <soapenv:Body>
                                    <sso:SsoAuthUserRequest>
                                        <sso:userCode>%s</sso:userCode>
                                        <sso:password>%s</sso:password>
                                    </sso:SsoAuthUserRequest>
                                </soapenv:Body>
                            </soapenv:Envelope>
            """ % (form_data.get('username'), form_data.get('passwd'))
            auth_info = requests.post('http://home.glodon.com:7783/Utilities/Account/ProxyService/SsoAuthUserProcess?wsdl', data=sign_in)
            if auth_info.status_code == 200:
                try:
                    xml_str = auth_info.text
                    b = minidom.parseString(xml_str)
                    sign_res = b.getElementsByTagName('result')[0].firstChild.data
                    if sign_res == 'Y':
                        status['success'] = True
                        status['msg'] = '登陆成功！'
                        request.session['username'] = form_data.get('username')
                        # 判断用户在acccessory系统中是否存在，不存在则创建
                        try:
                            user = accessory.list_users({'name': form_data.get('username')})
                            if user:
                                user = user[0]
                                _user = getattr(user, 'user')
                                permission = getattr(user, 'permission')
                                request.session['permission'] = permission['name']
                                request.session['user_id'] = _user['id']
                            else:
                                zone = accessory.get_zone({'name': get_employee_data(form_data.get('username'))['location']})
                                accessory.create_user({'name': form_data.get('username'), 'zone_id': zone.id})
                                request.session['permission'] = 'normal_user'
                        except Exception as e:
                                status['msg'] = str(e)
                        last_url = request.session.get('last_url', '').encode('utf8')
                        if last_url and last_url != REDIRECT_FIELD_NAME:
                            status['redirect'] = last_url
                    elif sign_res == 'L':
                        status['msg'] = '账号已被锁定！'
                except Exception as e:
                    status['msg'] = str(e)
        except Exception as e:
            status['msg'] = str(e)
    return HttpResponse(json.dumps(status, ensure_ascii=False))


@require_auth(True)
def user(request):
    status = \
        {
            'message': 'Get progress info successfully!',
            'user_id': '',
            'isAdmin': False,
            'superAdmin': False,
            'info': [{
                       'attr': 'ch_name',
                       'txt': ''
                       },
                       {
                        'attr': 'location',
                        'txt': ''
                       },{
                        'attr': 'email',
                        'txt': ''
                       },
                       {
                        'attr': 'phone',
                        'txt': ''
                       }]

        }

    username = request.session.get('username', '')
    permission = request.session.get('permission', '')
    status['user_id'] = request.session.get('user_id')
    status['superAdmin'] = permission == 'super_admin'
    status['isAdmin'] = 'admin' in permission
    user_data = get_employee_data(username)
    if user_data:
        status['info'][0]['txt'] = user_data.get('name')
        status['info'][1]['txt'] = location_map.get(user_data.get('location'), '')
        status['info'][2]['txt'] = user_data.get('email')
        status['info'][3]['txt'] = user_data.get('phone')
    # if user:
    #     status['user_id'] = getattr(user, 'id')
    return HttpResponse(json.dumps(status, ensure_ascii=False))


@require_auth(True)
def zones(request):
    status = \
        {
            'message': 'Get zones info successfully!',
            'zones': []
        }
    zones = accessory.list_zones()
    for zone in zones:
        status['zones'].append({
            'val': getattr(zone, 'id'),
            'name': getattr(zone, 'description')
        })
    return HttpResponse(json.dumps(status, ensure_ascii=False))


def components_list(request):
    status = \
        {
            'message': 'Get components list successfully!',
            'data': []
        }
    _get = request.GET
    try:
        components = accessory.list_accessories({
            'name': _get.get('name').encode("utf-8"),
            'type': _get.get('type'),
            'use_for': _get.get('use_for'),
            'status':  _get.get('status'),
            'zone':  _get.get('zone')
        })
        data = []
        for component in components:
            _accessory = getattr(component, 'accessory')
            accessoryandzone = getattr(component, 'accessoryandzone')
            zone = getattr(component, 'zone')
            accessory_id = _accessory.get('id')
            data.append({
                'id': accessory_id,
                'name': _accessory.get('name'),
                'sno': _accessory.get('sno'),
                'brand': _accessory.get('brand'),
                'type': type_map.get(_accessory.get('type')),
                'zone': location_map.get(zone.get('name'), ''),
                'count': accessoryandzone.get('total_number'),
                'href': '/app/components/component/%s' % accessory_id,
                'use_for': usefor_map.get(_accessory.get('use_for')),
                'status': u'已损坏' if _accessory.get('is_broken') else status_map.get(_accessory.get('status'), '')
            })
        status['data'] = data
    except Exception as e:
        status['message'] = str(e)
    return HttpResponse(json.dumps(status, ensure_ascii=False))


def components_detail(request, component_id):
    status = \
        {
            'message': 'Get component detail successfully!',
            'data': {}
        }
    try:
        component = accessory.get_accessory({'id': component_id})
        _accessory = getattr(component, 'accessory')
        accessoryandzone = getattr(component, 'accessoryandzone')
        zone = getattr(component, 'zone')
        status['data']['model'] = _accessory.get('brand')
        status['data']['name'] = _accessory.get('name')
        status['data']['sno'] = _accessory.get('sno')
        status['data']['id'] = component_id
        status['data']['zone'] = location_map.get(zone.get('name'), ''),
        status['data']['total_number'] = accessoryandzone.get('total_number'),
        status['data']['type'] = _accessory.get('type')
        status['data']['status'] = u'已损坏' if _accessory.get('is_broken') else status_map.get(_accessory.get('status'), '')
        status['data']['use_for'] = _accessory.get('use_for')
    except Exception as e:
        status['message'] = str(e)
    return HttpResponse(json.dumps(status, ensure_ascii=False))


def orders_list(request):
    status = \
        {
            'message': 'Get orders list successfully!',
            'data': []
        }
    _get = request.GET
    try:
        orders = accessory.list_orders({
            # 'name': _get.get('name').encode("utf-8")
        })
        data = []
        now = int(time.time())
        for order in orders:
            _accessory = getattr(order, 'accessory')
            # accessoryandzone = getattr(order, 'accessoryandzone')
            _order = getattr(order, 'order')
            user = getattr(order, 'user')
            zone = getattr(order, 'zone')
            order_state = u'进行中'
            if _order.get('finished_at'):
                order_state = u'已完成'
            elif _order.get('expired_at'):
                expired_at = int(time.mktime(time.strptime(_order.get('expired_at'), '%Y-%m-%d')))
                order_state = order_state if expired_at > now else u'已逾期'
            accessory_id = _accessory.get('id')
            data.append({
                'id': _order.get('id'),
                'accessory_id': accessory_id,
                'href': '/app/components/component/%s' % accessory_id,
                'brand': _accessory.get('brand'),
                'sno': _accessory.get('sno'),
                'name': _accessory.get('name'),
                'zone': location_map.get(zone.get('name'), ''),
                'range': u'%s 至 %s' % (_order.get('created_at'), _order.get('expired_at') or '--'),
                'bill': _order.get('bill'),
                'count': _order.get('count'),
                'user': user.get('name'),
                'order_state': order_state,
                'status': order_map.get(_order.get('status'), '')
            })
        status['data'] = data
    except Exception as e:
        status['message'] = str(e)
    return HttpResponse(json.dumps(status, ensure_ascii=False))


@require_auth(True, 'admin')
def users_list(request):
    status = \
        {
            'message': 'Get users list successfully!',
            'data': []
        }
    _get = request.GET
    try:
        users = accessory.list_users({
            # 'name': _get.get('name').encode("utf-8")
        })
        data = []
        for user in users:
            permission = getattr(user, 'permission')
            _user = getattr(user, 'user')
            zone = getattr(user, 'zone')
            print permission
            data.append({
                'id': _user.get('id'),
                'username': _user.get('name'),
                'zone': location_map.get(zone.get('name'), ''),
                'permission': permission_map.get(permission.get('name'), ''),
                'orig_permission': permission.get('name')
            })
        status['data'] = data
    except Exception as e:
        status['message'] = str(e)
    return HttpResponse(json.dumps(status, ensure_ascii=False))