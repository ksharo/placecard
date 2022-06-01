import os
# import pip3
# os.system("curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py")
# os.system("python3 get-pip.py")

# start frontend
print("starting frontend...")
os.system("cd placecardClient && npm i && npm start")

# # start backend
# print("starting backend...")
# os.system("cd placecardAPI && npm i && npm start &")

# # start server
# print("starting server")
# os.system("cd placecardAPI && pip install -r requirements.txt && python3 server.py &")
