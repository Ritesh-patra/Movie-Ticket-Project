export const kConverter = (num) => {

    if(typeof num !== "number"){
        return num; // agar number nahi hai to same return
    }

    if(num >= 1000){
        return (num / 1000).toFixed(1) + "k";
    }

    return num;
}
