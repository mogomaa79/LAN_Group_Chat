import socket

HOST = "0.0.0.0"
PORT = 65432

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    while True: 
        msg = input("YOU: ")
        s.sendall(msg.encode())
        data = s.recv(1024)
        print(f"SERVER: {str(data)[2:-1]}")