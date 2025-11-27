import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const categories = [
    { name: 'Toán Học', description: 'Toán lớp 1 - Học kỳ 2' },
    { name: 'Tiếng Việt', description: 'Tiếng Việt lớp 1 - Học kỳ 2' },
    { name: 'Tiếng Anh', description: 'Tiếng Anh lớp 1 - Học kỳ 2' },
];

export const mathQuestions = [
    // Phép cộng (không nhớ) trong phạm vi 100
    { q: "10 + 20 = ?", a: "30", b: "40", c: "20", d: "50", correct: "A" },
    { q: "30 + 40 = ?", a: "60", b: "70", c: "80", d: "50", correct: "B" },
    { q: "50 + 10 = ?", a: "50", b: "70", c: "60", d: "40", correct: "C" },
    { q: "25 + 4 = ?", a: "28", b: "29", c: "30", d: "27", correct: "B" },
    { q: "32 + 5 = ?", a: "37", b: "38", c: "36", d: "39", correct: "A" },
    { q: "41 + 7 = ?", a: "47", b: "49", c: "48", d: "50", correct: "C" },
    { q: "63 + 2 = ?", a: "64", b: "65", c: "66", d: "67", correct: "B" },
    { q: "80 + 9 = ?", a: "88", b: "90", c: "89", d: "87", correct: "C" },
    { q: "12 + 30 = ?", a: "42", b: "32", c: "52", d: "22", correct: "A" },
    { q: "24 + 20 = ?", a: "54", b: "44", c: "34", d: "64", correct: "B" },
    { q: "55 + 10 = ?", a: "75", b: "55", c: "65", d: "45", correct: "C" },
    { q: "36 + 40 = ?", a: "76", b: "66", c: "86", d: "56", correct: "A" },
    { q: "2 + 54 = ?", a: "55", b: "56", c: "57", d: "58", correct: "B" },
    { q: "3 + 62 = ?", a: "65", b: "66", c: "64", d: "63", correct: "A" },
    { q: "20 + 30 + 10 = ?", a: "50", b: "60", c: "70", d: "40", correct: "B" },
    { q: "40 + 10 + 20 = ?", a: "60", b: "80", c: "70", d: "90", correct: "C" },
    { q: "15 + 2 + 1 = ?", a: "17", b: "18", c: "19", d: "20", correct: "B" },
    { q: "23 + 10 + 5 = ?", a: "38", b: "33", c: "43", d: "28", correct: "A" },
    { q: "Số liền sau của 19 là?", a: "18", b: "20", c: "21", d: "17", correct: "B" },
    { q: "Số liền sau của 99 là?", a: "98", b: "100", c: "90", d: "101", correct: "B" },

    // Phép trừ (không nhớ) trong phạm vi 100
    { q: "50 - 20 = ?", a: "20", b: "40", c: "30", d: "10", correct: "C" },
    { q: "70 - 30 = ?", a: "40", b: "50", c: "30", d: "20", correct: "A" },
    { q: "90 - 40 = ?", a: "60", b: "40", c: "50", d: "30", correct: "C" },
    { q: "28 - 5 = ?", a: "22", b: "23", c: "24", d: "25", correct: "B" },
    { q: "39 - 6 = ?", a: "33", b: "34", c: "32", d: "35", correct: "A" },
    { q: "47 - 4 = ?", a: "42", b: "44", c: "43", d: "45", correct: "C" },
    { q: "65 - 3 = ?", a: "61", b: "62", c: "63", d: "64", correct: "B" },
    { q: "88 - 8 = ?", a: "80", b: "81", c: "79", d: "82", correct: "A" },
    { q: "45 - 20 = ?", a: "15", b: "35", c: "25", d: "45", correct: "C" },
    { q: "67 - 30 = ?", a: "37", b: "47", c: "27", d: "57", correct: "A" },
    { q: "92 - 10 = ?", a: "72", b: "82", c: "92", d: "62", correct: "B" },
    { q: "56 - 40 = ?", a: "26", b: "36", c: "16", d: "46", correct: "C" },
    { q: "80 - 30 - 10 = ?", a: "40", b: "50", c: "30", d: "20", correct: "A" },
    { q: "90 - 20 - 40 = ?", a: "20", b: "30", c: "40", d: "10", correct: "B" },
    { q: "18 - 5 - 2 = ?", a: "10", b: "11", c: "12", d: "13", correct: "B" },
    { q: "27 - 7 - 10 = ?", a: "20", b: "10", c: "0", d: "17", correct: "B" },
    { q: "Số liền trước của 10 là?", a: "9", b: "11", c: "8", d: "12", correct: "A" },
    { q: "Số liền trước của 50 là?", a: "51", b: "48", c: "49", d: "40", correct: "C" },
    { q: "Số lớn nhất có một chữ số là?", a: "10", b: "9", c: "8", d: "0", correct: "B" },
    { q: "Số nhỏ nhất có hai chữ số là?", a: "11", b: "9", c: "10", d: "12", correct: "C" },

    // Hình học & Đo lường
    { q: "Hình nào có 3 cạnh?", a: "Hình vuông", b: "Hình tròn", c: "Hình tam giác", d: "Hình chữ nhật", correct: "C" },
    { q: "Hình nào không có góc nào?", a: "Hình vuông", b: "Hình tròn", c: "Hình tam giác", d: "Hình chữ nhật", correct: "B" },
    { q: "10cm + 20cm = ?", a: "30", b: "30cm", c: "40cm", d: "20cm", correct: "B" },
    { q: "50cm - 30cm = ?", a: "20", b: "20cm", c: "30cm", d: "10cm", correct: "B" },
    { q: "Gang tay của em dài khoảng bao nhiêu?", a: "1cm", b: "15cm", c: "50cm", d: "1m", correct: "B" },
    { q: "Bước chân của em dài khoảng bao nhiêu?", a: "5cm", b: "30cm", c: "1m", d: "10cm", correct: "B" },
    { q: "Điểm ở giữa hai điểm A và B gọi là gì?", a: "Điểm đầu", b: "Điểm cuối", c: "Điểm ở giữa", d: "Trung điểm", correct: "C" },
    { q: "Một tuần lễ có mấy ngày?", a: "5 ngày", b: "6 ngày", c: "7 ngày", d: "8 ngày", correct: "C" },
    { q: "Hôm nay là thứ Hai, ngày mai là thứ mấy?", a: "Thứ Ba", b: "Thứ Tư", c: "Chủ Nhật", d: "Thứ Bảy", correct: "A" },
    { q: "Hôm qua là thứ Bảy, hôm nay là thứ mấy?", a: "Thứ Sáu", b: "Thứ Hai", c: "Chủ Nhật", d: "Thứ Ba", correct: "C" },

    // Thời gian
    { q: "Kim ngắn chỉ số 3, kim dài chỉ số 12. Là mấy giờ?", a: "12 giờ", b: "3 giờ", c: "3 giờ 12 phút", d: "12 giờ 3 phút", correct: "B" },
    { q: "Kim ngắn chỉ số 6, kim dài chỉ số 12. Là mấy giờ?", a: "6 giờ", b: "12 giờ", c: "6 giờ 30", d: "12 giờ 6", correct: "A" },
    { q: "Lúc 12 giờ, hai kim đồng hồ như thế nào?", a: "Thẳng hàng", b: "Trùng nhau", c: "Vuông góc", d: "Đối nhau", correct: "B" },
    { q: "Một ngày có bao nhiêu giờ?", a: "12 giờ", b: "20 giờ", c: "24 giờ", d: "10 giờ", correct: "C" },
    { q: "Buổi sáng em đi học lúc mấy giờ?", a: "2 giờ", b: "7 giờ", c: "12 giờ", d: "20 giờ", correct: "B" },
    { q: "Buổi tối em đi ngủ lúc mấy giờ?", a: "7 giờ sáng", b: "9 giờ tối", c: "12 giờ trưa", d: "3 giờ chiều", correct: "B" },
    { q: "Chủ nhật em có đi học không?", a: "Có", b: "Không", c: "Tùy lúc", d: "Buổi sáng", correct: "B" },
    { q: "Thứ Bảy là ngày gì?", a: "Ngày đi làm", b: "Ngày nghỉ cuối tuần", c: "Ngày đầu tuần", d: "Ngày giữa tuần", correct: "B" },
    { q: "Thứ Hai là ngày gì?", a: "Ngày cuối tuần", b: "Ngày đầu tuần", c: "Ngày nghỉ", d: "Ngày lễ", correct: "B" },
    { q: "Trong một tuần, ngày nào em được nghỉ?", a: "Thứ Hai", b: "Thứ Tư", c: "Chủ Nhật", d: "Thứ Sáu", correct: "C" },

    // Toán đố
    { q: "Lan có 10 cái kẹo, mẹ cho thêm 5 cái. Lan có tất cả bao nhiêu cái kẹo?", a: "10", b: "5", c: "15", d: "20", correct: "C" },
    { q: "Tổ em có 8 bạn, trong đó có 3 bạn nữ. Hỏi có bao nhiêu bạn nam?", a: "5", b: "4", c: "6", d: "11", correct: "A" },
    { q: "Trên cây có 15 con chim, bay đi 5 con. Còn lại bao nhiêu con?", a: "20", b: "10", c: "5", d: "15", correct: "B" },
    { q: "Lớp 1A có 30 bạn, lớp 1B có 32 bạn. Cả hai lớp có bao nhiêu bạn?", a: "60", b: "62", c: "52", d: "32", correct: "B" },
    { q: "An có 20 viên bi, Bình có 10 viên bi. Cả hai bạn có bao nhiêu viên bi?", a: "10", b: "20", c: "30", d: "40", correct: "C" },
    { q: "Mẹ mua 12 quả cam, biếu bà 6 quả. Mẹ còn lại bao nhiêu quả?", a: "18", b: "6", c: "2", d: "12", correct: "B" },
    { q: "Bố trồng được 20 cây, ông trồng được 15 cây. Cả hai người trồng được bao nhiêu cây?", a: "25", b: "30", c: "35", d: "40", correct: "C" },
    { q: "Nhà Lan nuôi 10 con gà trống và 20 con gà mái. Nhà Lan nuôi tất cả bao nhiêu con gà?", a: "10", b: "20", c: "30", d: "40", correct: "C" },
    { q: "Đoạn thẳng AB dài 5cm, đoạn thẳng BC dài 4cm. Đoạn thẳng AC dài bao nhiêu?", a: "1cm", b: "9cm", c: "8cm", d: "10cm", correct: "B" },
    { q: "Cây bút chì dài 15cm, cục tẩy dài 3cm. Cả hai dài bao nhiêu?", a: "12cm", b: "18cm", c: "15cm", d: "20cm", correct: "B" },

    // So sánh
    { q: "Số nào lớn nhất: 12, 54, 32, 19?", a: "12", b: "54", c: "32", d: "19", correct: "B" },
    { q: "Số nào bé nhất: 88, 9, 10, 21?", a: "88", b: "9", c: "10", d: "21", correct: "B" },
    { q: "Điền dấu thích hợp: 35 ... 53", a: ">", b: "<", c: "=", d: "+", correct: "B" },
    { q: "Điền dấu thích hợp: 80 ... 79", a: ">", b: "<", c: "=", d: "-", correct: "A" },
    { q: "Điền dấu thích hợp: 10 + 20 ... 30", a: ">", b: "<", c: "=", d: "-", correct: "C" },
    { q: "Điền dấu thích hợp: 50 - 10 ... 30", a: ">", b: "<", c: "=", d: "+", correct: "A" },
    { q: "Sắp xếp theo thứ tự từ bé đến lớn: 10, 5, 20, 15", a: "5, 10, 15, 20", b: "20, 15, 10, 5", c: "5, 15, 10, 20", d: "10, 20, 5, 15", correct: "A" },
    { q: "Sắp xếp theo thứ tự từ lớn đến bé: 40, 60, 30, 50", a: "30, 40, 50, 60", b: "60, 50, 40, 30", c: "60, 40, 50, 30", d: "30, 50, 40, 60", correct: "B" },
    { q: "Số tròn chục liền sau số 30 là?", a: "20", b: "31", c: "40", d: "50", correct: "C" },
    { q: "Số tròn chục liền trước số 90 là?", a: "80", b: "100", c: "89", d: "91", correct: "A" },

    // Mixed
    { q: "Số 55 đọc là gì?", a: "Năm năm", b: "Năm mươi năm", c: "Năm mươi lăm", d: "Lăm mươi lăm", correct: "C" },
    { q: "Số 'Bảy mươi tư' viết là?", a: "704", b: "74", c: "47", d: "70", correct: "B" },
    { q: "Số gồm 3 chục và 5 đơn vị là?", a: "305", b: "35", c: "53", d: "503", correct: "B" },
    { q: "Số gồm 8 chục và 0 đơn vị là?", a: "8", b: "80", c: "800", d: "08", correct: "B" },
    { q: "10 + ... = 15. Số cần điền là?", a: "5", b: "10", c: "25", d: "0", correct: "A" },
    { q: "... - 5 = 10. Số cần điền là?", a: "5", b: "10", c: "15", d: "20", correct: "C" },
    { q: "Hình vuông có mấy cạnh bằng nhau?", a: "2", b: "3", c: "4", d: "5", correct: "C" },
    { q: "Lá cờ Việt Nam hình gì?", a: "Hình vuông", b: "Hình tròn", c: "Hình chữ nhật", d: "Hình tam giác", correct: "C" },
    { q: "Bánh chưng hình gì?", a: "Hình vuông", b: "Hình tròn", c: "Hình chữ nhật", d: "Hình tam giác", correct: "A" },
    { q: "Mặt trăng rằm hình gì?", a: "Hình vuông", b: "Hình tròn", c: "Hình chữ nhật", d: "Hình tam giác", correct: "B" },
    { q: "20 + 20 + 20 = ?", a: "40", b: "50", c: "60", d: "70", correct: "C" },
    { q: "90 - 30 - 30 = ?", a: "30", b: "40", c: "50", d: "20", correct: "A" },
    { q: "12cm + 5cm = ?", a: "17", b: "17cm", c: "7cm", d: "15cm", correct: "B" },
    { q: "25cm - 5cm = ?", a: "20", b: "20cm", c: "30cm", d: "15cm", correct: "B" },
    { q: "Số lớn hơn 19 và nhỏ hơn 21 là?", a: "18", b: "20", c: "22", d: "19", correct: "B" },
    { q: "Số chẵn chục lớn nhất có hai chữ số là?", a: "99", b: "90", c: "100", d: "80", correct: "B" },
    { q: "Số lẻ nhỏ nhất có hai chữ số là?", a: "10", b: "11", c: "13", d: "15", correct: "B" },
    { q: "Kết quả của 10 + 0 là?", a: "0", b: "1", c: "10", d: "100", correct: "C" },
    { q: "Kết quả của 25 - 0 là?", a: "0", b: "25", c: "5", d: "20", correct: "B" },
    { q: "Kết quả của 40 - 40 là?", a: "40", b: "1", c: "0", d: "80", correct: "C" },
    // Additional 20 Math Questions
    { q: "Số 100 có mấy chữ số?", a: "1", b: "2", c: "3", d: "4", correct: "C" },
    { q: "Số 5 có mấy chữ số?", a: "1", b: "2", c: "3", d: "0", correct: "A" },
    { q: "Hình tròn có mấy góc?", a: "1", b: "2", c: "3", d: "0", correct: "D" },
    { q: "Đồng hồ chỉ 12 giờ, kim ngắn ở số mấy?", a: "6", b: "12", c: "3", d: "9", correct: "B" },
    { q: "Một tuần em đi học mấy ngày (thứ 2 đến thứ 6)?", a: "5", b: "6", c: "7", d: "4", correct: "A" },
    { q: "10 + 10 + 10 + 10 = ?", a: "30", b: "40", c: "50", d: "20", correct: "B" },
    { q: "50 - 10 - 10 - 10 = ?", a: "10", b: "20", c: "30", d: "40", correct: "B" },
    { q: "Số liền sau của 89 là?", a: "88", b: "90", c: "91", d: "80", correct: "B" },
    { q: "Số liền trước của 100 là?", a: "90", b: "99", c: "98", d: "101", correct: "B" },
    { q: "30cm + 20cm - 10cm = ?", a: "40cm", b: "50cm", c: "30cm", d: "20cm", correct: "A" },
    { q: "15 + 3 = ?", a: "18", b: "17", c: "19", d: "16", correct: "A" },
    { q: "19 - 4 = ?", a: "15", b: "16", c: "14", d: "13", correct: "A" },
    { q: "12 + 6 = ?", a: "18", b: "19", c: "17", d: "20", correct: "A" },
    { q: "18 - 6 = ?", a: "12", b: "13", c: "14", d: "11", correct: "A" },
    { q: "14 + 5 = ?", a: "19", b: "18", c: "17", d: "20", correct: "A" },
    { q: "17 - 5 = ?", a: "12", b: "13", c: "11", d: "14", correct: "A" },
    { q: "11 + 8 = ?", a: "19", b: "18", c: "20", d: "17", correct: "A" },
    { q: "19 - 8 = ?", a: "11", b: "12", c: "10", d: "9", correct: "A" },
    { q: "13 + 4 = ?", a: "17", b: "16", c: "18", d: "15", correct: "A" },
    { q: "17 - 4 = ?", a: "13", b: "12", c: "14", d: "11", correct: "A" }
];

export const vietQuestions = [
    // Additional 14 Vietnamese Questions
    { q: "Câu đố: Con gì đuôi ngắn tai dài, Mắt hồng lông mượt, có tài chạy nhanh?", a: "Con thỏ", b: "Con mèo", c: "Con chó", d: "Con chuột", correct: "A" },
    { q: "Câu đố: Con gì mào đỏ, Gáy ó o o, Từ sáng tinh mơ, Gọi người thức dậy?", a: "Con gà trống", b: "Con vịt", c: "Con ngan", d: "Con ngỗng", correct: "A" },
    { q: "Câu đố: Quả gì mặc áo vàng xanh, Ăn thì ngọt mát, uống thì thanh thanh?", a: "Quả cam", b: "Quả chanh", c: "Quả bưởi", d: "Quả dưa", correct: "A" },
    { q: "Điền từ: 'Ăn quả nhớ kẻ ... cây'", a: "trồng", b: "hái", c: "mua", d: "bán", correct: "A" },
    { q: "Điền từ: 'Uống nước nhớ ...'", a: "nguồn", b: "suối", c: "sông", d: "biển", correct: "A" },
    { q: "Từ nào chỉ người thân trong gia đình?", a: "Cô giáo", b: "Bác sĩ", c: "Ông ngoại", d: "Bạn bè", correct: "C" },
    { q: "Từ nào chỉ đồ dùng học tập?", a: "Cái chổi", b: "Cái bát", c: "Cái bảng", d: "Cái kìm", correct: "C" },
    { q: "Từ nào viết đúng?", a: "Xinh xắn", b: "Xinh sắn", c: "Sinh xắn", d: "Sinh sắn", correct: "A" },
    { q: "Từ nào viết đúng?", a: "Sắp xếp", b: "Sắp sếp", c: "Xắp xếp", d: "Xắp sếp", correct: "A" },
    { q: "Từ nào viết đúng?", a: "Dòng sông", b: "Giòng sông", c: "Ròng sông", d: "Dồng sông", correct: "A" },
    { q: "Tiếng 'mẹ' có thanh gì?", a: "Nặng", b: "Huyền", c: "Sắc", d: "Hỏi", correct: "A" },
    { q: "Tiếng 'bố' có thanh gì?", a: "Sắc", b: "Huyền", c: "Nặng", d: "Ngã", correct: "A" },
    { q: "Tiếng 'bà' có thanh gì?", a: "Huyền", b: "Sắc", c: "Nặng", d: "Hỏi", correct: "A" },
    { q: "Tiếng 'ông' có thanh gì?", a: "Thanh ngang (không dấu)", b: "Huyền", c: "Sắc", d: "Nặng", correct: "A" },
    // Chính tả (c/k, g/gh, ng/ngh)
    { q: "Điền vào chỗ trống: ...éo co", a: "k", b: "c", c: "q", d: "kh", correct: "A" },
    { q: "Điền vào chỗ trống: con ...à", a: "g", b: "gh", c: "ng", d: "ngh", correct: "A" },
    { q: "Điền vào chỗ trống: ...ế gỗ", a: "g", b: "gh", c: "ng", d: "ngh", correct: "B" },
    { q: "Điền vào chỗ trống: ...ỉ ngơi", a: "ng", b: "ngh", c: "g", d: "gh", correct: "B" },
    { q: "Điền vào chỗ trống: ...ô khoai", a: "ng", b: "ngh", c: "n", d: "nh", correct: "A" },
    { q: "Điền vào chỗ trống: ...ả cá", a: "ch", b: "tr", c: "t", d: "th", correct: "A" },
    { q: "Điền vào chỗ trống: cái ...ống", a: "ch", b: "tr", c: "t", d: "th", correct: "B" },
    { q: "Từ nào viết đúng chính tả?", a: "nghe nhạc", b: "nge nhạc", c: "ghe nhạc", d: "nghen hạc", correct: "A" },
    { q: "Từ nào viết đúng chính tả?", a: "con kiến", b: "con ciến", c: "con quyến", d: "con kiếng", correct: "A" },
    { q: "Từ nào viết đúng chính tả?", a: "ghồ ghề", b: "gồ ghề", c: "gồ gề", d: "ghồ gề", correct: "B" },
    { q: "Từ nào viết sai chính tả?", a: "kể chuyện", b: "cể chuyện", c: "cây cầu", d: "kỳ lạ", correct: "B" },
    { q: "Từ nào viết sai chính tả?", a: "nghi ngờ", b: "ngi ngờ", c: "nghỉ hè", d: "ngẫm nghĩ", correct: "B" },

    // Vần (anh/ach, ên/êt, om/op...)
    { q: "Tiếng 'sách' có vần gì?", a: "ach", b: "anh", c: "ich", d: "ech", correct: "A" },
    { q: "Tiếng 'xanh' có vần gì?", a: "anh", b: "ang", c: "am", d: "an", correct: "A" },
    { q: "Tiếng 'chim' có vần gì?", a: "im", b: "iem", c: "in", d: "ip", correct: "A" },
    { q: "Tiếng 'học' có vần gì?", a: "oc", b: "op", c: "on", d: "om", correct: "A" },
    { q: "Tìm tiếng có vần 'om'?", a: "chó đốm", b: "con tôm", c: "quả cam", d: "làng xóm", correct: "D" },
    { q: "Tìm tiếng có vần 'ât'?", a: "đất đai", b: "quả gấc", c: "lất phất", d: "cả A và C", correct: "D" },
    { q: "Tìm tiếng có vần 'uyên'?", a: "con thuyền", b: "bình yên", c: "viên phấn", d: "tiền lẻ", correct: "A" },
    { q: "Tìm tiếng có vần 'oe'?", a: "hoa huệ", b: "mạnh khỏe", c: "khe khẽ", d: "vui vẻ", correct: "B" },

    // Từ vựng & Đồng nghĩa/Trái nghĩa
    { q: "Trái nghĩa với 'đen' là gì?", a: "đỏ", b: "trắng", c: "xanh", d: "vàng", correct: "B" },
    { q: "Trái nghĩa với 'cao' là gì?", a: "thấp", b: "ngắn", c: "bé", d: "gầy", correct: "A" },
    { q: "Trái nghĩa với 'khóc' là gì?", a: "buồn", b: "cười", c: "hét", d: "nói", correct: "B" },
    { q: "Trái nghĩa với 'siêng năng' là gì?", a: "chăm chỉ", b: "lười biếng", c: "ngoan ngoãn", d: "thông minh", correct: "B" },
    { q: "Đồng nghĩa với 'chăm chỉ' là gì?", a: "lười biếng", b: "siêng năng", c: "hư hỏng", d: "nhút nhát", correct: "B" },
    { q: "Đồng nghĩa với 'ba' là gì?", a: "mẹ", b: "bố", c: "bà", d: "ông", correct: "B" },
    { q: "Con vật nào kêu 'meo meo'?", a: "Con chó", b: "Con mèo", c: "Con gà", d: "Con lợn", correct: "B" },
    { q: "Con vật nào kêu 'gâu gâu'?", a: "Con chó", b: "Con mèo", c: "Con gà", d: "Con vịt", correct: "A" },
    { q: "Con gì là 'chúa sơn lâm'?", a: "Con voi", b: "Con hổ", c: "Con khỉ", d: "Con gấu", correct: "B" },
    { q: "Con gì nhả tơ dệt vải?", a: "Con nhện", b: "Con tằm", c: "Con ong", d: "Con kiến", correct: "B" },
    { q: "Cây gì có quả màu đỏ, ăn chua?", a: "Cây bàng", b: "Cây khế", c: "Cây chanh", d: "Cây ớt", correct: "C" },
    { q: "Quả gì vỏ xanh ruột đỏ hạt đen?", a: "Quả cam", b: "Quả dưa hấu", c: "Quả táo", d: "Quả nho", correct: "B" },
    { q: "Mùa nào nóng nhất trong năm?", a: "Mùa xuân", b: "Mùa hè", c: "Mùa thu", d: "Mùa đông", correct: "B" },
    { q: "Mùa nào lạnh nhất trong năm?", a: "Mùa xuân", b: "Mùa hè", c: "Mùa thu", d: "Mùa đông", correct: "D" },
    { q: "Ngày Tết cổ truyền là mùa nào?", a: "Mùa xuân", b: "Mùa hè", c: "Mùa thu", d: "Mùa đông", correct: "A" },
    { q: "Ngày khai trường là mùa nào?", a: "Mùa xuân", b: "Mùa hè", c: "Mùa thu", d: "Mùa đông", correct: "C" },

    // Điền từ & Câu
    { q: "Điền từ: 'Học thầy không tày học ...'", a: "bạn", b: "cha", c: "mẹ", d: "anh", correct: "A" },
    { q: "Điền từ: 'Công cha như núi ...'", a: "Thái Sơn", b: "Phú Sĩ", c: "cao", d: "lớn", correct: "A" },
    { q: "Điền từ: 'Nghĩa mẹ như nước trong ... chảy ra'", a: "suối", b: "nguồn", c: "biển", d: "sông", correct: "B" },
    { q: "Điền từ: 'Chị ngã em ...'", a: "đỡ", b: "nâng", c: "cười", d: "khóc", correct: "B" },
    { q: "Điền từ: 'Lá lành đùm lá ...'", a: "rách", b: "nát", c: "héo", d: "xanh", correct: "A" },
    { q: "Câu nào đúng?", a: "Bé đang ngũ.", b: "Bé đang ngủ.", c: "Bé đang ngũ.", d: "Bé dang ngủ.", correct: "B" },
    { q: "Câu nào đúng?", a: "Con mèo chèo cây cau.", b: "Con mèo trèo cây cau.", c: "Con mèo chèo cây cao.", d: "Con mèo trèo cây cao.", correct: "B" },
    { q: "Sắp xếp thành câu: 'đi / bé / học'", a: "Bé đi học", b: "Học đi bé", c: "Đi học bé", d: "Bé học đi", correct: "A" },
    { q: "Sắp xếp thành câu: 'yêu / em / mẹ'", a: "Mẹ yêu em", b: "Em yêu mẹ", c: "Cả A và B", d: "Yêu mẹ em", correct: "C" },
    { q: "Sắp xếp thành câu: 'trường / đến / em'", a: "Em đến trường", b: "Trường đến em", c: "Đến trường em", d: "Em trường đến", correct: "A" },

    // Đọc hiểu (câu ngắn)
    { q: "Đọc câu: 'Bà em rất hiền.' Ai rất hiền?", a: "Bà", b: "Mẹ", c: "Bố", d: "Ông", correct: "A" },
    { q: "Đọc câu: 'Mặt trời mọc ở đằng Đông.' Mặt trời mọc ở đâu?", a: "Đằng Tây", b: "Đằng Đông", c: "Đằng Nam", d: "Đằng Bắc", correct: "B" },
    { q: "Đọc câu: 'Con ong chăm chỉ hút mật.' Con gì chăm chỉ?", a: "Con bướm", b: "Con kiến", c: "Con ong", d: "Con chim", correct: "C" },
    { q: "Đọc câu: 'Bé Lan đi học lớp 1.' Bé Lan học lớp mấy?", a: "Lớp 2", b: "Lớp 1", c: "Lớp 3", d: "Mẫu giáo", correct: "B" },
    { q: "Trong bài thơ 'Mèo con đi học', mèo con quên cái gì?", a: "Bút chì", b: "Cái mũ", c: "Ăn sáng", d: "Quyển vở", correct: "C" },
    { q: "Ai là người sinh ra em?", a: "Bố", b: "Mẹ", c: "Bà", d: "Cô giáo", correct: "B" },
    { q: "Ai là người dạy em học ở trường?", a: "Bố mẹ", b: "Ông bà", c: "Thầy cô giáo", d: "Bạn bè", correct: "C" },
    { q: "Nơi em đến để học tập gọi là gì?", a: "Công viên", b: "Trường học", c: "Bệnh viện", d: "Siêu thị", correct: "B" },
    { q: "Khi gặp người lớn em phải làm gì?", a: "Chào hỏi", b: "Làm ngơ", c: "Chạy đi", d: "Khóc nhè", correct: "A" },
    { q: "Trước khi ăn cơm em phải làm gì?", a: "Đi ngủ", b: "Rửa tay", c: "Xem tivi", d: "Chơi đồ chơi", correct: "B" },

    // Thêm câu hỏi để đủ 100
    { q: "Từ nào chỉ màu sắc?", a: "Xanh", b: "Chạy", c: "Bàn", d: "Nhanh", correct: "A" },
    { q: "Từ nào chỉ hoạt động?", a: "Đỏ", b: "Ngủ", c: "Ghế", d: "Đẹp", correct: "B" },
    { q: "Từ nào chỉ đồ vật?", a: "Vàng", b: "Hát", c: "Bút", d: "Cao", correct: "C" },
    { q: "Từ nào chỉ tính chất?", a: "Mèo", b: "Đi", c: "Sách", d: "Ngoan", correct: "D" },
    { q: "Tiếng 'gà' có âm đầu là gì?", a: "g", b: "a", c: "à", d: "ga", correct: "A" },
    { q: "Tiếng 'lá' có thanh gì?", a: "Huyền", b: "Sắc", c: "Hỏi", d: "Ngã", correct: "B" },
    { q: "Tiếng 'bàn' có vần gì?", a: "an", b: "ba", c: "ban", d: "n", correct: "A" },
    { q: "Chữ cái đầu tiên trong bảng chữ cái là?", a: "B", b: "C", c: "A", d: "D", correct: "C" },
    { q: "Chữ cái cuối cùng trong bảng chữ cái là?", a: "X", b: "Y", c: "V", d: "Y", correct: "B" },
    { q: "Bác Hồ tên thật là gì?", a: "Nguyễn Sinh Cung", b: "Nguyễn Tất Thành", c: "Nguyễn Ái Quốc", d: "Hồ Chí Minh", correct: "A" },
    { q: "Thủ đô của Việt Nam là gì?", a: "Hồ Chí Minh", b: "Hà Nội", c: "Đà Nẵng", d: "Huế", correct: "B" },
    { q: "Quốc kỳ Việt Nam màu gì?", a: "Đỏ sao vàng", b: "Xanh sao vàng", c: "Đỏ sao trắng", d: "Vàng sao đỏ", correct: "A" },
    { q: "Bác sĩ làm việc ở đâu?", a: "Trường học", b: "Bệnh viện", c: "Nhà máy", d: "Đồng ruộng", correct: "B" },
    { q: "Công nhân làm việc ở đâu?", a: "Nhà máy", b: "Bệnh viện", c: "Trường học", d: "Cửa hàng", correct: "A" },
    { q: "Nông dân làm việc ở đâu?", a: "Nhà máy", b: "Đồng ruộng", c: "Văn phòng", d: "Bệnh viện", correct: "B" },
    { q: "Giáo viên làm việc ở đâu?", a: "Bệnh viện", b: "Trường học", c: "Nhà máy", d: "Công an", correct: "B" },
    { q: "Chú bộ đội làm nhiệm vụ gì?", a: "Khám bệnh", b: "Dạy học", c: "Bảo vệ tổ quốc", d: "Bán hàng", correct: "C" },
    { q: "Con trâu giúp bác nông dân làm gì?", a: "Bắt chuột", b: "Cày ruộng", c: "Giữ nhà", d: "Đẻ trứng", correct: "B" },
    { q: "Con mèo giúp em làm gì?", a: "Bắt chuột", b: "Cày ruộng", c: "Đẻ trứng", d: "Kéo xe", correct: "A" },
    { q: "Con chó giúp em làm gì?", a: "Bắt chuột", b: "Giữ nhà", c: "Đẻ trứng", d: "Cày ruộng", correct: "B" },
    { q: "Cây lúa cho ta hạt gì?", a: "Hạt ngô", b: "Hạt gạo", c: "Hạt đỗ", d: "Hạt lạc", correct: "B" },
    { q: "Con gà mái đẻ ra cái gì?", a: "Con gà con", b: "Quả trứng", c: "Sữa", d: "Lông", correct: "B" },
    { q: "Con bò cho ta cái gì?", a: "Trứng", b: "Sữa", c: "Gạo", d: "Vải", correct: "B" },
    { q: "Cái gì dùng để viết?", a: "Thước kẻ", b: "Bút", c: "Tẩy", d: "Sách", correct: "B" },
    { q: "Cái gì dùng để kẻ?", a: "Bút", b: "Thước kẻ", c: "Tẩy", d: "Vở", correct: "B" },
    { q: "Cái gì dùng để tẩy?", a: "Bút", b: "Thước", c: "Cục tẩy", d: "Cặp sách", correct: "C" },
    { q: "Cái gì dùng để đựng sách vở?", a: "Cặp sách", b: "Hộp bút", c: "Túi quần", d: "Giỏ xe", correct: "A" },
    { q: "Khi đi học về em phải làm gì?", a: "Chào ông bà, cha mẹ", b: "Vứt cặp sách", c: "Chạy đi chơi", d: "Đòi ăn quà", correct: "A" },
    { q: "Khi nhận quà em phải làm gì?", a: "Cầm lấy", b: "Cảm ơn", c: "Chê bai", d: "Vứt đi", correct: "B" },
    { q: "Khi mắc lỗi em phải làm gì?", a: "Xin lỗi", b: "Cãi lại", c: "Đổ lỗi", d: "Khóc", correct: "A" }
];

export const engQuestions = [
    // Numbers (1-20)
    { q: "One + One = ?", a: "One", b: "Two", c: "Three", d: "Four", correct: "B" },
    { q: "Ten - Five = ?", a: "Four", b: "Five", c: "Six", d: "Seven", correct: "B" },
    { q: "What number is this: 10?", a: "Nine", b: "Ten", c: "Eleven", d: "Twelve", correct: "B" },
    { q: "What number is this: 5?", a: "Four", b: "Five", c: "Six", d: "Seven", correct: "B" },
    { q: "How many fingers do you have?", a: "Five", b: "Ten", c: "Two", d: "One", correct: "B" },
    { q: "Count: One, Two, Three, ...?", a: "Five", b: "Four", c: "Six", d: "Zero", correct: "B" },
    { q: "Number 'Seven' in Vietnamese is?", a: "Số 6", b: "Số 7", c: "Số 8", d: "Số 9", correct: "B" },
    { q: "Number 'Twenty' in Vietnamese is?", a: "12", b: "20", c: "21", d: "10", correct: "B" },
    { q: "Which is number 'Eight'?", a: "6", b: "7", c: "8", d: "9", correct: "C" },
    { q: "Which is number 'Three'?", a: "2", b: "3", c: "4", d: "5", correct: "B" },

    // Colors
    { q: "What color is the sun?", a: "Blue", b: "Yellow", c: "Green", d: "Black", correct: "B" },
    { q: "What color is the sky?", a: "Blue", b: "Red", c: "Yellow", d: "Green", correct: "A" },
    { q: "What color is an apple?", a: "Blue", b: "Red", c: "Black", d: "White", correct: "B" },
    { q: "What color is a leaf?", a: "Red", b: "Green", c: "Blue", d: "Pink", correct: "B" },
    { q: "What color is a cloud?", a: "Green", b: "White", c: "Red", d: "Yellow", correct: "B" },
    { q: "'Màu đen' in English is?", a: "White", b: "Black", c: "Blue", d: "Brown", correct: "B" },
    { q: "'Màu tím' in English is?", a: "Pink", b: "Purple", c: "Orange", d: "Red", correct: "B" },
    { q: "'Màu cam' in English is?", a: "Orange", b: "Red", c: "Yellow", d: "Green", correct: "A" },
    { q: "Mix Red and Yellow, you get?", a: "Green", b: "Orange", c: "Purple", d: "Blue", correct: "B" },
    { q: "Mix Blue and Yellow, you get?", a: "Green", b: "Orange", c: "Purple", d: "Red", correct: "A" },

    // Animals
    { q: "What animal says 'Meow'?", a: "Dog", b: "Cat", c: "Pig", d: "Duck", correct: "B" },
    { q: "What animal says 'Woof'?", a: "Cat", b: "Dog", c: "Cow", d: "Bird", correct: "B" },
    { q: "What animal says 'Moo'?", a: "Cow", b: "Pig", c: "Sheep", d: "Horse", correct: "A" },
    { q: "What animal can fly?", a: "Dog", b: "Bird", c: "Cat", d: "Fish", correct: "B" },
    { q: "What animal can swim?", a: "Bird", b: "Fish", c: "Cat", d: "Rabbit", correct: "B" },
    { q: "'Con voi' in English is?", a: "Tiger", b: "Elephant", c: "Lion", d: "Monkey", correct: "B" },
    { q: "'Con khỉ' in English is?", a: "Monkey", b: "Donkey", c: "Tiger", d: "Bear", correct: "A" },
    { q: "'Con gà' in English is?", a: "Chicken", b: "Duck", c: "Bird", d: "Pig", correct: "A" },
    { q: "'Con vịt' in English is?", a: "Chicken", b: "Duck", c: "Bird", d: "Fish", correct: "B" },
    { q: "Is a tiger big or small?", a: "Small", b: "Big", c: "Short", d: "Thin", correct: "B" },

    // Family
    { q: "Who is your father?", a: "Bố", b: "Mẹ", c: "Anh", d: "Chị", correct: "A" },
    { q: "Who is your mother?", a: "Bố", b: "Mẹ", c: "Ông", d: "Bà", correct: "B" },
    { q: "Who is your sister?", a: "Anh trai", b: "Chị/Em gái", c: "Bố", d: "Mẹ", correct: "B" },
    { q: "Who is your brother?", a: "Chị gái", b: "Anh/Em trai", c: "Bà", d: "Ông", correct: "B" },
    { q: "Who is your grandmother?", a: "Ông", b: "Bà", c: "Bố", d: "Mẹ", correct: "B" },
    { q: "Who is your grandfather?", a: "Ông", b: "Bà", c: "Anh", d: "Chị", correct: "A" },
    { q: "I love my ...", a: "Family", b: "School", c: "Pen", d: "Book", correct: "A" },
    { q: "This is my ... (picture of dad)", a: "Mother", b: "Father", c: "Sister", d: "Baby", correct: "B" },
    { q: "Do you have a brother?", a: "Yes, I do", b: "Yes, I am", c: "No, I am not", d: "Yes, it is", correct: "A" },
    { q: "How many people are in your family?", a: "I am fine", b: "Four", c: "Yes", d: "No", correct: "B" },

    // School & Toys
    { q: "What is this? (Picture of a pen)", a: "Pencil", b: "Pen", c: "Book", d: "Bag", correct: "B" },
    { q: "What is this? (Picture of a book)", a: "Bag", b: "Book", c: "Ruler", d: "Rubber", correct: "B" },
    { q: "What is this? (Picture of a bag)", a: "Book", b: "Bag", c: "Pen", d: "Pencil", correct: "B" },
    { q: "What is this? (Picture of a ball)", a: "Doll", b: "Ball", c: "Car", d: "Robot", correct: "B" },
    { q: "What is this? (Picture of a doll)", a: "Ball", b: "Doll", c: "Kite", d: "Bike", correct: "B" },
    { q: "Is this a ruler?", a: "Yes, it is", b: "No, it is", c: "Yes, I am", d: "No, I am", correct: "A" },
    { q: "Do you like cars?", a: "Yes, I do", b: "Yes, I am", c: "No, I am", d: "Yes, it is", correct: "A" },
    { q: "Open your ...", a: "Book", b: "Pen", c: "Ruler", d: "Pencil", correct: "A" },
    { q: "Close your ...", a: "Book", b: "Pencil", c: "Bag", d: "Ruler", correct: "A" },
    { q: "Stand ...", a: "Up", b: "Down", c: "In", d: "On", correct: "A" },
    { q: "Sit ...", a: "Up", b: "Down", c: "In", d: "On", correct: "B" },

    // Body parts
    { q: "What is this? (Eye)", a: "Nose", b: "Eye", c: "Ear", d: "Mouth", correct: "B" },
    { q: "What is this? (Nose)", a: "Eye", b: "Nose", c: "Hand", d: "Leg", correct: "B" },
    { q: "What is this? (Mouth)", a: "Ear", b: "Mouth", c: "Arm", d: "Foot", correct: "B" },
    { q: "What is this? (Hand)", a: "Leg", b: "Hand", c: "Head", d: "Face", correct: "B" },
    { q: "How many eyes do you have?", a: "One", b: "Two", c: "Three", d: "Four", correct: "B" },
    { q: "How many noses do you have?", a: "One", b: "Two", c: "Ten", d: "Five", correct: "A" },
    { q: "Touch your ...", a: "Head", b: "Book", c: "Pen", d: "Bag", correct: "A" },
    { q: "Clap your ...", a: "Hands", b: "Legs", c: "Eyes", d: "Ears", correct: "A" },
    { q: "Stomp your ...", a: "Hands", b: "Feet", c: "Eyes", d: "Nose", correct: "B" },
    { q: "Wash your ...", a: "Face", b: "Book", c: "Pencil", d: "Ruler", correct: "A" },

    // Food & Drink
    { q: "Do you like pizza?", a: "Yes, I do", b: "Yes, I am", c: "No, I am", d: "Yes, it is", correct: "A" },
    { q: "Do you like milk?", a: "Yes, I do", b: "No, it isn't", c: "Yes, I am", d: "No, I am", correct: "A" },
    { q: "What is this? (Apple)", a: "Banana", b: "Apple", c: "Orange", d: "Grape", correct: "B" },
    { q: "What is this? (Banana)", a: "Apple", b: "Banana", c: "Mango", d: "Lemon", correct: "B" },
    { q: "'Cơm' in English is?", a: "Noodle", b: "Rice", c: "Bread", d: "Meat", correct: "B" },
    { q: "'Sữa' in English is?", a: "Water", b: "Milk", c: "Juice", d: "Tea", correct: "B" },
    { q: "'Nước' in English is?", a: "Milk", b: "Water", c: "Rice", d: "Cake", correct: "B" },
    { q: "I am hungry. I want to ...", a: "Drink", b: "Eat", c: "Sleep", d: "Run", correct: "B" },
    { q: "I am thirsty. I want to ...", a: "Eat", b: "Drink", c: "Read", d: "Sing", correct: "B" },
    { q: "What is your favorite food?", a: "I like chicken", b: "I like blue", c: "I like cat", d: "I like football", correct: "A" },

    // Greetings & Common Phrases
    { q: "Hello, how are you?", a: "I'm fine, thank you", b: "I'm five", c: "My name is Lan", d: "Goodbye", correct: "A" },
    { q: "What is your name?", a: "I'm fine", b: "My name is Nam", c: "I'm six", d: "Hello", correct: "B" },
    { q: "How old are you?", a: "I'm fine", b: "I'm six years old", c: "My name is Hoa", d: "Thank you", correct: "B" },
    { q: "Nice to meet you.", a: "Goodbye", b: "Nice to meet you, too", c: "I'm fine", d: "Thank you", correct: "B" },
    { q: "Goodbye!", a: "Hello", b: "Bye bye", c: "Thank you", d: "I'm fine", correct: "B" },
    { q: "Thank you.", a: "You're welcome", b: "Goodbye", c: "Hello", d: "I'm fine", correct: "A" },
    { q: "Good morning.", a: "Good night", b: "Good morning", c: "Goodbye", d: "Thank you", correct: "B" },
    { q: "Good night.", a: "Good morning", b: "Good night", c: "Hello", d: "I'm fine", correct: "B" },
    { q: "Sorry.", a: "Thank you", b: "That's okay", c: "Goodbye", d: "Hello", correct: "B" },
    { q: "Can you help me?", a: "Yes, I can", b: "No, I am", c: "Yes, I am", d: "No, it is", correct: "A" }
];

export async function seedDatabase(prisma: PrismaClient) {
    console.log('Start seeding 300 REAL questions...');

    // 1. Clear existing data (Order matters for Foreign Keys)
    await prisma.answer.deleteMany({});
    await prisma.quizSession.deleteMany({});
    await prisma.question.deleteMany({});
    // await prisma.category.deleteMany({}); // Optional: Keep categories if IDs are stable

    console.log('Cleared existing questions and sessions');

    // 2. Create Users (Admin & S-Admin)
    const hashedPassword = await bcrypt.hash('1234', 10);

    await prisma.user.upsert({
        where: { username: 'admin' },
        update: { password: hashedPassword, role: 'admin' },
        create: { username: 'admin', password: hashedPassword, role: 'admin' },
    });

    await prisma.user.upsert({
        where: { username: 's-admin' },
        update: { password: hashedPassword, role: 's-admin' },
        create: { username: 's-admin', password: hashedPassword, role: 's-admin' },
    });

    // 3. Create Categories
    const catMap: { [key: string]: number } = {};
    for (const c of categories) {
        const cat = await prisma.category.upsert({
            where: { name: c.name },
            update: { description: c.description },
            create: c,
        });
        catMap[c.name] = cat.id;
    }

    // 4. Insert Questions
    const allQuestions = [
        ...mathQuestions.slice(0, 50).map(q => ({ ...q, categoryId: catMap['Toán Học'] })),
        ...vietQuestions.slice(0, 50).map(q => ({ ...q, categoryId: catMap['Tiếng Việt'] })),
        ...engQuestions.slice(0, 50).map(q => ({ ...q, categoryId: catMap['Tiếng Anh'] })),
    ];

    console.log(`Preparing to insert ${allQuestions.length} questions (50 per category)...`);

    for (const q of allQuestions) {
        await prisma.question.create({
            data: {
                question: q.q,
                optionA: q.a,
                optionB: q.b,
                optionC: q.c,
                optionD: q.d,
                correctAnswer: q.correct,
                categoryId: q.categoryId,
            },
        });
    }

    console.log('Seeding finished successfully!');
}
