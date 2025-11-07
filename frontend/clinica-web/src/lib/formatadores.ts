export const formatters = {
    cpf: (valor: string): string => {
        // Remove tudo que não é número
        const apenasNumeros = valor.replace(/\D/g, '');

        // Aplica a formatação
        return apenasNumeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    },

    telefone: (valor: string): string => {
        const apenasNumeros = valor.replace(/\D/g, '');

        return apenasNumeros
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    },

    data: (valor: string): string => {
        const apenasNumeros = valor.replace(/\D/g, '');

        return apenasNumeros
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\/\d{4})\d+?$/, '$1');
    }
};