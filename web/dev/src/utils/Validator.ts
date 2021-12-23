class Validator {
    private maxLength = 15;
    private minLength = 3;
    private rules = {
        lengthValid: {
            error: (fieldName = 'поля') =>
                (`Длинна ${fieldName} должна находиться в пределах от ${this.minLength} до ${this.maxLength}`),
            validate: (str: string) => (str?.length <= this.maxLength && str?.length >= this.minLength),
        },
        isEmail: {
            error: 'Такого email не существует',
            validate: (str: string) => (/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(str)),
        },
        isGroupName: {
            error: 'Такой группы не существует',
            validate: (str: string) => (/^(К)|(ЛТ)[0-9]{1,2}-[0-9]{2,3}((Б)|(М)|(А))?$/.test(str)),
        },
        nameSymbols: {
            error: 'Имя может состоять только из букв и знака -',
            validate: (str: string) => (/[а-яА-Я-]+/.test(str)),
        },
        passwordSymbols: {
            error: 'Пароль может состоять только из латинских букв и цифр',
            validate: (str: string) => (/[A-Za-z0-9]+/.test(str)),
        },
    }

    validateEmail(email: string): string {
        if (!this.rules.isEmail.validate(email)) {
            return this.rules.isEmail.error;
        }
        return '';
    }

    validateGroup(group: string): string {
        if (!this.rules.isGroupName.validate(group)) {
            return this.rules.isGroupName.error;
        }
        return '';
    }

    validateName(name: string): string {
        if (!this.rules.nameSymbols.validate(name)) {
            return this.rules.nameSymbols.error;
        }
        if (!this.rules.lengthValid.validate(name)) {
            return this.rules.lengthValid.error('имени');
        }
        return '';
    }

    validatePassword(password: string): string {
        if (!this.rules.passwordSymbols.validate(password)) {
            return this.rules.passwordSymbols.error;
        }
        if (!this.rules.lengthValid.validate(password)) {
            return this.rules.lengthValid.error('пароля');
        }
        return '';
    }
}

export default new Validator();
