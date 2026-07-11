order = input("Enter order: Coffe or Tea :")
if order == "Coffe" or order == "c":
    # print("Coffe")
    preference = input("you selected Coffee \n Do you want milk : Yes or No : ")
    if preference == "Yes" or preference == "y":
        print("Milk Added")
    else:
        print("Milk isn't Added")
elif order == "Tea" or order == "t":
    print("Tea")
    preference = input("Do you want sugar : Yes or No : ")
    if preference == "Yes" or preference == "y":
        print("Sugar Added")
    else:
        print("Sugar isn't Added")
else:
    print("Please enter Coffee or Tea ")