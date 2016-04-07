# -*- coding:utf-8 -*-
# Copyright Glodon.com

import httplib
import socket
import traceback
from lxml import etree

from oslo.config import cfg

location_map = {
    'glodonds': u'一期',
    'glodoner': u'二期',
    'shichuang': u'实创',
}

usefor_map = {
    'provide': u'领用',
    'rent': u'租用',
    'provide_and_rent': u'不限'
}

type_map = {
    'normal': u'普通',
    'consumable': u'消耗品'
}

status_map = {
    'free': u'空闲中',
    'provide': u'领用中',
    'rent': u'租用中'
}

order_map = {
    'provide': u'领用',
    'rent': u'租用'
}

permission_map = {
    'normal_user': u'普通用户',
    'normal_admin': u'管理员',
    'super_admin': u'超级管理员',
}

hr_opts = [
    cfg.StrOpt('hr_server_address', default='me.grandsoft.com.cn'),
    cfg.IntOpt('hr_server_port', default=8080),
]

DEPARTMENT_LEVEL_MAP = {u'2': 1,
                        u'3': 2,
                        u'4': 3}

CONF = cfg.CONF
CONF.register_opts(hr_opts, 'hr')

    
def get_employee_data(account_name, local=True):
    if not account_name:
        return None
    
    account_name = account_name.lower()
    
    xml = None
    employees = []

    if local:
        with open('/etc/asset/employee.xml') as f:
            xml = etree.fromstring(f.read())
    else:
        hr_server_address = 'home.glodon.com'
        hr_server_port = 7783
        try:
            body_content = """<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.glodon.com/soa/utilities/servicemonitor/schema/CustomSoapHeader/V1.0" xmlns:si="http://xmlns.oracle.com/Enterprise/Tools/schemas/SI_GET_EMP_REQUEST">
               <soapenv:Header>
                  <v1:CustomSOAPHeader>
                     <v1:conversationId></v1:conversationId>
                     <v1:consumer>chenyl-e</v1:consumer>
                     <v1:provider>GLODON_SOA_PEOPLESOFT_EMPLOYEE_002</v1:provider>
                     <v1:messageType></v1:messageType>
                     <v1:remark1></v1:remark1>
                     <v1:remark2></v1:remark2>
                     <v1:remark3></v1:remark3>
                     <v1:remark4></v1:remark4>
                     <v1:remark5></v1:remark5>
                  </v1:CustomSOAPHeader>
               </soapenv:Header>
               <soapenv:Body>
                  <si:getEmpRequest>
                     <si:SETID>GLD00</si:SETID>
                     <si:NATIONAL_ID></si:NATIONAL_ID>
                     <si:EMPLID></si:EMPLID>
                     <si:GLD_DOMAIN_ACCOUNT>%s</si:GLD_DOMAIN_ACCOUNT>
                     <si:StatusNationalID></si:StatusNationalID>
                     <si:EmpNATIONAL_ID></si:EmpNATIONAL_ID>
                  </si:getEmpRequest>
               </soapenv:Body>
            </soapenv:Envelope>""" % account_name
            request = httplib.HTTP(hr_server_address, hr_server_port)
            request.putrequest("POST", "/Peoplesoft/Employee/ProxyService/HrPsEmpQuerySvcProxy?wsdl")
            request.putheader("Host", hr_server_address)
            request.putheader("Content-Type", "application/soap+xml; charset=utf-8")
            request.putheader("Content-Length", str(len(body_content)))
            request.endheaders()
            request.send(body_content)
            (status_code, message, reply_headers) = request.getreply()
            if status_code == 200:
                xml = etree.fromstring(f.read())
        except socket.error as err:
            print str(err)
        except Exception as ex:
            print str(ex)
        finally:
            request.close()
        
    namespace = 'http://xmlns.oracle.com/Enterprise/Tools/schemas/SI_GET_EMP_RESPONSE'
    employee_elements = xml.findall('.//{%s}%s' %(namespace, 'GLD_SI_EMP_V'))
    for employee_e in employee_elements:
        try:
            employee = {}
            employee['account_name'] = employee_e.find('{%s}%s' %(namespace, 'GLD_DOMAIN_ACCOUNT')).text.lower()
            if employee['account_name'] != account_name:
                continue
            employee['number'] = employee_e.find('{%s}%s' %(namespace, 'EMPLID')).text
            employee['location'] = employee_e.find('{%s}%s' %(namespace, 'LOCATION')).text.lower()
            employee['name'] = employee_e.find('{%s}%s' %(namespace, 'NAME_DISPLAY')).text
            employee['phone'] = employee_e.find('{%s}%s' %(namespace, 'PHONE')).text
            employee['email'] = employee_e.find('{%s}%s' %(namespace, 'EMAILID')).text
            employee['dept_id'] = employee_e.find('{%s}%s' %(namespace, 'DEPTID')).text
            employees.append(employee)
        except:
            pass
     
    employee_elements_dict = {}
    for employee in employees:
        employee_elements_dict[employee['account_name']] = employee
        
    excepted_employee = employee_elements_dict.get(account_name)
    
    return excepted_employee
