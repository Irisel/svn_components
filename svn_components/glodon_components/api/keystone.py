# -*- coding: utf-8 -*-
from keystoneclient.v2_0 import client
from django.conf import settings
import os


def get_token():
    """获取token"""
    keystone = client.Client(username=settings.USERNAME, password=settings.PASSWORD,
                             tenant_name=settings.TENANTNAME, auth_url=settings.AUTH_URL)
    return keystone.auth_token

