export const randomSigns = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPRSTQWZ1234567890kflahueiyw7qi4ilqbelgyatdoaSDSWASDulbytd6a3ljEFFJASU8r4';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}