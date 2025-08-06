

export class Format {

    static byteToMegaByte( bytes: number ) {
        const mb = bytes / (1024 * 1024);
        return Intl.NumberFormat('en', {
            style: 'unit',
            unit: 'mb',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        }).format(mb);
    }

    static percent ( percentage: number ) {
        return Intl.NumberFormat('en', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(percentage/100);
    }

    static dateToDateTime ( date: Date ): string {
        const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
        const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
        const year = date.getFullYear();

        const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
}