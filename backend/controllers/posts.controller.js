//checking api that it working or not 
export const activeCheck = async (req,res) =>{
    return res.status(200).json({message : "RUNNING SERVER API"});
}
