senha_correta = "2520"

for tentativa in range(3):
    senha = input("Digite a senha: ")
    print("tentar novamente")
    if senha == senha_correta:
        print("Acesso Permitido")
        break
else:
    print("Conta Bloqueada")


