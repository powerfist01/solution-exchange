const subjects = { 
    1: 'HIST-1301 USA History', 2: 'MUSI-1306 Music Appreciation', 3: 'GOVT-2305 Federal Govt', 4: 'BIO-1406-Bio for Sci Majors', 5: 'Chemistry', 6: 'Calc 1', 7: 'English 1', 8: 'English 2', 9: 'Intro to Psychology', 10: 'Soc-100', 11: 'CIS-100Intro to Info Tech', 12: 'Geo-132 world Reg Geo', 13: 'MGT-231 supervision & Teambuilding', 14: 'Criminal Justice', 15: 'Intro to Chemistry', 16: 'Calc2', 17: 'Calc 4', 18: 'statistic', 19: 'Microbiology', 20: 'Bio-131', 21: 'eng-132', 22: 'Maths', 23: 'Physics', 24: 'Eng. Physics 2', 25: 'English 2', 26: 'Circuits and system 2', 27: 'Eng. Physics 1', 28: 'Anatomy', 29: 'Math-175', 30: 'Math-115', 31: 'Math-155', 32: 'Bio-131', 33: 'SPH-101', 34: 'PHL-201 (Philosophy)', 35: 'Eng-130 Intro to Engineering', 36: 'Engr-125 Intro to comp', 37: 'Mat-131 (Mat for mod world)', 38: 'Mat-131 (statistics)', 39: 'ECO-101 (Economics)', 40: 'PHY-232(Eng Physics)', 41: 'Bio -131 (Intro to bio)', 42: 'PHY-275 (Physics)', 43: 'TCM-131 (Telecommunication)', 44: 'Soc-131 (Sociology)', 45: 'Mat-172 (Calculus-2)', 46: 'Mat-171 (Calculus-1)', 47: 'Mat-271 (Calculus-3)', 48: 'PHL-101 (Comp Religion)', 49: 'Bio-250 (Anatomy)', 50: 'Bio-295 (Microbiology)', 51: 'Soc-100 (Sociology)', 52: 'Bio-155 (Bio)', 53: 'Bio-151 (Bio)', 54: 'Eng-131 (English)', 55: 'Mth-31 (geo and cal )', 56: 'Acc-110 (Accounting)', 57: 'BUS-225 (Com App in Bus)', 58: 'PSY-200 (Psychology)', 59: 'Eng-119(English)', 60: 'Eng-120 (English)', 61: 'Senior Design', 62: 'Ethics', 63: 'Analog Communication', 64: 'Math 115', 65: 'ECE-319-001 (Electro Comp)', 66: 'ECE-385(Electronic devices)', 67: 'IMSE-421(Eng Eco )', 68: 'Ece-4361 Elec Mac and drive', 69: 'ECE-311 ( Electronic Circuit 1)', 70: 'ECE-3171 (Ana&DiscSig&sys)', 71: 'ECE-3731 (Micro & Emb)', 72: 'ECE-273 (Digital System)', 73: 'IMSE-317 (Prob & Statistic)', 74: 'Ece-270 Comp meth( C++)', 75: 'ENGR 400 Business', 76: 'Discrete Maths', 77: 'ECE 413 (VLSI Design)', 78: 'ECE 414 Elec Sys Des', 79: 'ECE 4432 (Power system)', 80: 'miscellaneous work' 
}

function getSubjectUsingKey(key){
    return subjects[key];
}

function getAllSubjects(){
    let allSubjects = [];
    for (const [key, value] of Object.entries(subjects)) {
        let obj = {};
        obj["id"] = key;
        obj["subjectName"] = value;
        allSubjects.push(obj);
      }
    return allSubjects;
}

module.exports = {
    getAllSubjects, getSubjectUsingKey
}