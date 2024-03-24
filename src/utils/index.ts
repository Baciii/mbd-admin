export const mapNumberToLetter = (number: number) => {
    // 将数字转换为对应的 ASCII 码
    const asciiValue = number + 65; // 'A' 的 ASCII 码是 65

    // 将 ASCII 码转换为字母
    const letter = String.fromCharCode(asciiValue);

    return letter;
};
