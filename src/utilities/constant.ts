export const LOGO_IMG = require('../../assets/App/logo.png');
export const getCompanySizeLabel = (size: string | undefined) => {
    switch (size) {
        case "LESS_THAN_10":
            return "Dưới 10 nhân viên";
        case "FROM_10_TO_24":
            return "10 - 24 nhân viên";
        case "FROM_25_TO_99":
            return "25 - 99 nhân viên";
        case "FROM_100_TO_499":
            return "100 - 499 nhân viên";
        case "FROM_500_TO_999":
            return "500 - 999 nhân viên";
        case "FROM_1000_TO_4999":
            return "1.000 - 4.999 nhân viên";
        case "FROM_5000_TO_9999":
            return "5.000 - 9.999 nhân viên";
        case "FROM_10000_TO_19999":
            return "10.000 - 19.999 nhân viên";
        case "FROM_20000_TO_49999":
            return "20.000 - 49.999 nhân viên";
        case "MORE_THAN_50000":
            return "Trên 50.000 nhân viên";
        default:
            return "Chưa cập nhật";
    }
};
