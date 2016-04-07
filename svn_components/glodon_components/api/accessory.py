# -*- coding: utf-8 -*-

from assetclient.v1 import client as asset_client
from django.conf import settings
from glodon_components.api import keystone


def assetclient():
    """获取asset client"""
    username = settings.USERNAME
    token = keystone.get_token()
    tenant_id = settings.TENANT_ID
    asset_url = '%s%s' % (settings.ASSET_URL, tenant_id)
    client = asset_client.Client(username, token, project_id=tenant_id, auth_url=asset_url, insecure=False, cacert=None)
    client.client.auth_token = token
    client.client.management_url = asset_url
    return client

def list_users(query):
    """列举用户信息"""
    return assetclient().accessories.list_users(query)

def list_zones():
    """列举区域"""
    return assetclient().accessories.list_zones()

def list_accessories(query):
    """列举配件信息"""
    return assetclient().accessories.list_accessories(query)

def list_orders(query):
    """列举订单信息"""
    return assetclient().accessories.list_orders(query)

def get_user(query):
    """获取用户信息"""
    return assetclient().accessories.get_user(query)

def get_zone(query):
    """获取用户信息"""
    return assetclient().accessories.get_zone(query)

def get_accessory(query):
    """获取配件信息"""
    return assetclient().accessories.get_accessory(query)

def get_order(query):
    """获取配件信息"""
    return assetclient().accessories.get_order(query)

def create_user(values):
    """创建用户"""
    return assetclient().accessories.create_user(values)

def create_accessory(values):
    """添加配件"""
    return assetclient().accessories.create_accessory(values)

def create_accessoryandzone(values):
    """添加配件和区域关系"""
    return assetclient().accessories.create_accessoryandzone(values)

def create_order(values):
    """添加订单"""
    return assetclient().accessories.create_order(values)

def update_accessory(accessory_id, values):
    """更改配件"""
    return assetclient().accessories.update_accessory(accessory_id, values)

def update_order(order_id, values):
    """更改订单"""
    return assetclient().accessories.update_order(order_id, values)

def finished_order(values):
    """完成订单"""
    return assetclient().accessories.finished_order(values)

def update_permission(values):
    """添加/更改权限信息"""
    return assetclient().accessories.update_permission(values)
