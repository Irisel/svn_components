# -*- coding: utf-8 -*-

import logging
from django.http import HttpResponse
import json
from glodon_components.dashboard.common.decorator import require_auth
from glodon_components.api import keystone, accessory
import datetime
LOG = logging.getLogger(__name__)


@require_auth(True, 'admin')
def create_component(request):
    status = \
        {
            'message': 'Create component fail!',
            'success': False
        }
    if request.method == 'POST':
        try:
            post_data = json.loads(request.raw_post_data)
            form = post_data.get('form')
            ay = accessory.create_accessory(form)
            values = {'zone_id': form['zone'], 'accessory_id': ay.id,\
                      'total_number': form['count']}
            accessory.create_accessoryandzone(values)
            status['success'] = True
            status['message'] = 'Create component successfully!'
        except Exception as e:
            status['message'] = str(e)
    return HttpResponse(json.dumps(status, ensure_ascii=False))


@require_auth(True, 'admin')
def rent_component(request):
    status = \
        {
            'message': 'Rent component fail!',
            'success': False
        }
    if request.method == 'POST':
        try:
            post_data = json.loads(request.raw_post_data)
            form = post_data.get('form')
            if form.has_key('sno'):
                # normal类型 
                rent_range = form.pop('rent_range')
                created_at = datetime.datetime.strptime("%s 00:00:00" % rent_range[0], "%Y-%m-%d %H:%M:%S")
                expired_at = datetime.datetime.strptime("%s 00:00:00" % rent_range[1], "%Y-%m-%d %H:%M:%S")
                user = accessory.get_user({'name': form['username']})
                ay = accessory.get_accessory({'sno': form['sno']}).accessory
                if ay['status'] == 'free':
                    form_attrs = {'user_id': user.id, 'accessory_id': ay['id'], 'operator_id': form['operator_id'],\
                                  'zone_id': user.zone_id, 'count': 1, 'status': 'rent', 'type': 'normal',\
                                  'created_at': str(created_at), 'expired_at': str(expired_at)}
                    accessory.create_order(form_attrs)
                    accessory.update_accessory(ay['id'], {'status': 'rent'})
                    status['success'] = True
                    status['message'] = 'Create component successfully!'
                else:
                    status['success'] = False
                    status['message'] = 'Create component failed, the status of accessory is not free!'
            else:
                # consumable类型 
                rent_range = form.pop('rent_range')
                created_at = datetime.datetime.strptime("%s 00:00:00" % rent_range[0], "%Y-%m-%d %H:%M:%S")
                expired_at = datetime.datetime.strptime("%s 00:00:00" % rent_range[1], "%Y-%m-%d %H:%M:%S")
                user = accessory.get_user({'name': form['username']})
                ay = accessory.get_accessory({'id': form['id']}).accessory
                if ay['status'] == 'free':
                    form_attrs = {'user_id': user.id, 'accessory_id': ay['id'], 'operator_id': form['operator_id'],\
                                  'zone_id': user.zone_id, 'count': 1, 'status': 'rent', 'type': 'consumable',\
                                  'created_at': str(created_at), 'expired_at': str(expired_at)}
                    accessory.create_order(form_attrs)
                    status['success'] = True
                    status['message'] = 'Create component successfully!'
                else:
                    status['success'] = False
                    status['message'] = 'Create component failed, the status of accessory is not free!'
                
        except Exception as e:
            status['message'] = str(e)
    return HttpResponse(json.dumps(status, ensure_ascii=False))


@require_auth(True, 'admin')
def provide_component(request):
    status = \
        {
            'message': 'Provide component fail!',
            'success': False
        }
    if request.method == 'POST':
        try:
            post_data = json.loads(request.raw_post_data)
            form = post_data.get('form')
            if form.has_key('sno'):
                # normal类型
                provide_range = form.pop('provide_range')
                created_at = datetime.datetime.strptime("%s 00:00:00" % provide_range, "%Y-%m-%d %H:%M:%S")
                user = accessory.get_user({'name': form['username']})
                ay = accessory.get_accessory({'sno': form['sno']}).accessory
                if ay['status'] == 'free':
                    form_attrs = {'user_id': user.id, 'accessory_id': ay['id'], 'operator_id': form['operator_id'],\
                                  'zone_id': user.zone_id, 'count': 1, 'status': 'provide', 'type': 'normal',\
                                  'created_at': str(created_at)}
                    accessory.create_order(form_attrs)
                    accessory.update_accessory(ay['id'], {'status': 'provide'})
                    status['success'] = True
                    status['message'] = 'Create component successfully!'
                else:
                    status['success'] = False
                    status['message'] = 'Create component failed, the status of accessory is not free!'
            else:
                # consumable类型
                provide_range = form.pop('provide_range')
                created_at = datetime.datetime.strptime("%s 00:00:00" % provide_range, "%Y-%m-%d %H:%M:%S")
                user = accessory.get_user({'name': form['username']})
                ay = accessory.get_accessory({'id': form['id']}).accessory
                if ay['status'] == 'free':
                    form_attrs = {'user_id': user.id, 'accessory_id': ay['id'], 'operator_id': form['operator_id'],\
                                  'zone_id': user.zone_id, 'count': 1, 'status': 'provide', 'type': 'consumable',\
                                  'created_at': str(created_at)}
                    accessory.create_order(form_attrs)
                    status['success'] = True
                    status['message'] = 'Create component successfully!'
                else:
                    status['success'] = False
        except Exception as e:
            status['message'] = str(e)
    return HttpResponse(json.dumps(status, ensure_ascii=False))


@require_auth(True, 'admin')
def return_component(request):
    status = \
        {
            'message': 'Create component success!',
            'success': False
        }
    if request.method == 'POST':
        try:
            post_data = json.loads(request.raw_post_data)
            form = post_data.get('form')
            accessory.finished_order(form)
            status['success'] = True
        except Exception as e:
            status['message'] = str(e)
    return HttpResponse(json.dumps(status, ensure_ascii=False))


@require_auth(True, 'super_admin')
def update_user(request):
    status = \
        {
            'message': 'Update user success!',
            'success': False
        }
    if request.method == 'POST':
        try:
            post_data = json.loads(request.raw_post_data)
            form = post_data.get('form')
            accessory.update_permission(form)
            status['success'] = True
        except Exception as e:
            status['message'] = str(e)
    return HttpResponse(json.dumps(status, ensure_ascii=False))
