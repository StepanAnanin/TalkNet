interface ParsedDate {
    day: number;
    month: number;
    year: number;
}

export default class FormatedDate {
    protected readonly rawDate: number;
    protected readonly date: Date;

    public readonly parsedDate: ParsedDate;

    public static dayDifference(date1: number, date2: number) {
        return Math.trunc((date1 - date2) / 1000 / 60 / 60 / 24);
    }

    constructor(date: number) {
        this.rawDate = date;

        this.date = new Date(date);

        this.parsedDate = {
            day: this.date.getDay(),
            month: this.date.getMonth(),
            year: this.date.getFullYear(),
        };
    }

    public getTime() {
        let hour: number | string = this.date.getHours();
        let minutes: number | string = this.date.getMinutes();

        if (hour < 10) {
            hour = "0" + hour;
        }

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        return `${hour}:${minutes}`;
    }

    public getDate() {
        let day: number | string = this.date.getDate();
        let month: number | string = this.date.getMonth();

        if (day < 10) {
            day = "0" + day;
        }

        if (month < 10) {
            month = "0" + month;
        }

        return `${day}.${month}.${this.date.getFullYear()}`;
    }
}
