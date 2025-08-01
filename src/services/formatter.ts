

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
}