
print("casar ou comprar uma bicicleta")

resposta = input("voce esta gordo? s/n")

if resposta =="s":
    quer_emagrecer = input("voce quer emagrecer s/n")
    if quer_emagrecer =="s":
        print("compre uma bicicleta")
    else:
        print("entao case")
else:
    quer_engordar = input("voce quer emagrecer s/n")
    if quer_engordar =="s":
        print("entao case")
    else:
        print("compre uma bicicleta")