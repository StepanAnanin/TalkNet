interface ParsedDate {
    day: number;
    month: number;
    year: number;
}

export default class FormatedDate {
    protected readonly date: Date;

    public readonly rawDate: number;
    public readonly parsedDate: ParsedDate;

    public static dayDifference(date1: number, date2: number) {
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);

        firstDate.setHours(0, 0, 0, 0);
        secondDate.setHours(0, 0, 0, 0);

        return Math.trunc((firstDate.getTime() - secondDate.getTime()) / 1000 / 60 / 60 / 24);
    }

    public static isYesterday(rawTargetDate: number, rawCheckDate: number) {
        const checkDate = new Date(rawCheckDate);
        const yesterdayTargetDate = new Date(rawTargetDate);

        checkDate.setHours(0, 0, 0, 0);
        yesterdayTargetDate.setHours(0, 0, 0, 0);
        yesterdayTargetDate.setDate(yesterdayTargetDate.getDate() - 1);

        return checkDate.getTime() === yesterdayTargetDate.getTime();
    }

    constructor(date: number) {
        this.rawDate = date;

        this.date = new Date(date);

        // There is a stupidest thing i've ever seen — method '.getMoth' counting from 0 ...
        this.parsedDate = {
            day: this.date.getDay(),
            month: this.date.getMonth() + 1,
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
        let month: number | string = this.date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }

        if (month < 10) {
            month = "0" + month;
        }

        return `${day}.${month}.${this.date.getFullYear()}`;
    }
}
