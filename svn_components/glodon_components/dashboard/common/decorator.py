# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.http import HttpResponseRedirect
import json
REDIRECT_FIELD_NAME = '/login'


def require_auth(is_ajax=None, permission=None, redirect_field_name=REDIRECT_FIELD_NAME):
    ''' validate_decorator '''
    status = {'success': False,
                'message': u'',
                'redirect_to': redirect_field_name}
    def _validate(func):
        def __validate(*args, **kwargs):
            _request = args[0]
            # Do before
            try:
                # Do after
                session = _request.session
                if session.get('username', None) and session.get('permission', None):
                    if permission and permission not in session.get('permission'):
                        status['message'] = 'permission denied, require %s' % permission
                        result = HttpResponse(json.dumps(status, ensure_ascii=False))
                    result = func(*args, **kwargs)
                elif is_ajax:
                    result = HttpResponse(json.dumps(status, ensure_ascii=False))
                else:
                    _request.session['last_url'] = _request.path
                    result = HttpResponseRedirect(REDIRECT_FIELD_NAME)
            except Exception as e:
                status['message'] = str(e)
                result = HttpResponse(json.dumps(status, ensure_ascii=False))
            finally:
                return result
        return __validate
    return _validate
