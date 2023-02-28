export const randomSigns = (length: number): string => {
    let result = '';
    const characters = 'kfl;ahueiyw7qi4ilqbelgyatdoaulbytd6a3 ljEFFJASU8r4';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}