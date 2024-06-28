import json
import os

user_data = []

def separate_data(file_path, user_data_file_path):
    load_user_data(user_data_file_path)
    data = []
    users = []
    users_id = []
    with open(file_path, 'r') as file:
        for line in file:
            data.append(json.loads(line))

    for i in data:
        user = {
            "user_id": "",
            "solid_localId": "",
            "solid_webId": "",
            "idp": "",
            "name": "",
            "email": "",
            "podname": "",
            "password": "",
            "auth": "",
            "sensing_data": []
        }

        if get_user(i['header']['user_id'], users) is None:
            user_credentialas = get_user_data(i['header']['user_id'])
            users_id.append(i['header']['user_id'])
            user['user_id'] = user_credentialas['user_id']
            user['solid_localId'] = user_credentialas['solid_localId']
            user['solid_webId'] = user_credentialas['solid_webId']
            user['idp'] = user_credentialas['idp']
            user['name'] = user_credentialas['name']
            user['email'] = user_credentialas['email']
            user['podname'] = user_credentialas['podname']
            user['password'] = user_credentialas['password']
            user['auth'] = user_credentialas['auth']
            users.append(user)
        else:
            user = users[get_user(i['header']['user_id'], users)]

        del i['header']['user_id']
        user['sensing_data'].append(i)

    for user in users:
        user_file_name = "../community-server/" + user['user_id'] + ".json"
        if not exist_file(user_file_name):
            with open(user_file_name, 'w') as file:
                file.write(json.dumps(user['sensing_data']))
        cred_file_name = "../community-server/" + user['user_id'] + "_cred.json"
        if not exist_file(cred_file_name):
            with open(cred_file_name, 'w') as file:
                del user['sensing_data']
                file.write(json.dumps(user))
    return users_id


def load_user_data(user_data_file_path):
    global user_data

    f = open(user_data_file_path)
    user_data = json.load(f)
    f.close()


def get_user_data(user_id):
    global user_data

    for user in user_data['users']:
        if user['user_id'] == user_id:
            return user
    return None


def get_user(user_id, users):
    for user in users:
        if user['user_id'] == user_id:
            return users.index(user)
    return None


def exist_file(file):
    if os.path.exists(file):
        return True
    else:
        return False
