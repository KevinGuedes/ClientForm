export function sleepForSeconds(seconds: number = 0.5): Promise<any> {
    //Yes, this function was made just foy you to see my beautiful spinner progress
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
