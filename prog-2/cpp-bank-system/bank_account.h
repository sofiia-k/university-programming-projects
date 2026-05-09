#ifndef BANK_ACCOUNT_H
#define BANK_ACCOUNT_H

#include<iostream>
#include<vector>
#include<exception>
#include<string>
#include<memory>
#include <map>

class Customer;

enum class Account_Type{ STANDARD, SPECIAL };

const std::vector<std::string> account_type{"Standard" , "Special"};

inline std::ostream& operator<<(std::ostream& o, Account_Type at){
    o << account_type.at(static_cast<size_t>(at));
    return o;
}



class Account{
private:
    unsigned id;
    std::string name;
    int dispo;
    int amount;
    std::map<unsigned, std::weak_ptr<Customer>> owners;
    inline static unsigned next_id = 0;
public:

Account(std::string name, int dispo, int amount, std::shared_ptr<Customer> owner);

virtual ~Account() = default;

virtual int withdraw(int x){
    if(x <= 0) throw std::runtime_error("Amount must be positive");
    if (amount - x < -1*dispo) throw std::runtime_error("Not enough money on your account");

    amount = amount - x;
    return amount;
}

int get_amount() const{
    return amount;
}

std::string get_name() const{
    return name;
}

int deposit(int x){
    if(x <= 0) throw std::runtime_error("Amount must be positive");
    amount += x;
    return amount;
}

unsigned get_id() const {
    return id;
}

unsigned owner_count() const{
    unsigned count = 0;
    for (const auto& [id, wptr] : owners) {
        if (auto sp = wptr.lock()) {
            count++;
        }
    }
    return count;
}

bool share_account(std::shared_ptr<Customer> new_owner);


bool remove_owner(unsigned id){
    if (owners.size() == 1) return false;
    return owners.erase(id) > 0;
}

int get_dispo () const{
    return dispo;
}

virtual std::string additional_output() const = 0;

friend std::ostream& operator<<(std::ostream& o, const Account& p);

void print_short(std::ostream& o) const {
    o << "[" << name << ", " << owner_count() << "]";
}


};



class Standard_Account : public Account {
public:

Standard_Account(std::string name, int dispo, int amount, std::shared_ptr<Customer> owner) : Account(name, dispo, amount, owner){}

std::string additional_output() const override{
    return "Standard";
}



};



class Special_Account : public Account{
int fee;
public:

Special_Account(std::string name, int dispo, int amount, std::shared_ptr<Customer> owner,int fee) : Account(name, dispo, amount, owner), fee(fee){
    if(fee <= 0) throw std::runtime_error("no fees");
}



int withdraw(int x) override{
    if(x <= 0) throw std::runtime_error("Amount must be positive");
    return Account::withdraw(x+fee);
}



std::string additional_output() const override{
    return "Special, " + std::to_string(fee);
}



};


#endif