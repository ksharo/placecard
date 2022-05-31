import os
# start frontend
print("starting frontend...")
os.system("cd placecardClient && npm i && npm start &")
# # start backend
print("starting backend...")
os.system("cd placecardAPI && npm i && npm start &")

# # start server
print("starting server")
os.system("cd placecardAPI && python3 server.py &")
