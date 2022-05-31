import os
# start frontend
os.system("cd placecardClient")
os.system("npm i")
os.system("npm start")
print("started frontend")

# start backend
os.system("cd ../placecardAPI")
os.system("npm i")
os.system("npm start")
print("started backend")

# start server
os.system("python3 server.py")
print("started server")