continuar = "S"
#lower serve pra deixar o codigo funcionar com letra maiuscula
while continuar.lower  () == "s":
    num = int(input("digite um numero: "))# aqui vc coloca o numero
    print(num)
    if num % 2 == 0:
        print("PAR")
    else:
        print("INPAR")

    continuar = input("deseja continuar? s/n ")

# entendendo a logica do while