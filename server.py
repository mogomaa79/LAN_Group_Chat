import socket

HOST = "0.0.0.0"
PORT = 65432

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()

    conn, addr = s.accept()

    with conn:
        print("Connected by", addr)
        while True:
            data = conn.recv(1024)
            if not data:
                break
            print(f"{addr[0]}: {str(data)[2:-1]}")
            msg = input("YOU: ")
            conn.sendall(msg.encode())
