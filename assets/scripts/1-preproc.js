"use strict";

/**
 * File to process CSV data. 
 */
function loadDiplomeData(data) {
        //load the data and put them in the needed format

        var grade1 = [];
        var grade2 = [];
        var grade3 = [];

        var cycles = [];

        var etudiants = [];

        for (var i = 0; i < 5; i++) {
                var etudiantsGrade = [];
                etudiants.push(etudiantsGrade);
        }

        var gradeBac = { grade: 'Bac', etudiant: etudiants[0] };
        var gradeCertificat = { grade: 'Certificat', etudiant: etudiants[1] };
        var gradeMaitriseProfession = { grade: 'Maitrise professionn', etudiant: etudiants[2] };
        var gradeMaitriseRecherche = { grade: 'Maitrise recherche', etudiant: etudiants[3] };
        var gradeDoctorat = { grade: 'Doctorat', etudiant: etudiants[4] };

        grade1.push(gradeBac);
        grade1.push(gradeCertificat);
        grade2.push(gradeMaitriseProfession);
        grade2.push(gradeMaitriseRecherche);
        grade3.push(gradeDoctorat);

        var cycle1 = { cycleNumber: 1, grades: grade1 };
        var cycle2 = { cycleNumber: 2, grades: grade2 };
        var cycle3 = { cycleNumber: 3, grades: grade3 };

        cycles.push(cycle1);
        cycles.push(cycle2);
        cycles.push(cycle3);

        data.forEach(element => {
                cycles.forEach(subElement => {
                        if (subElement.cycleNumber == element.Cycle) {
                                subElement.grades.forEach(gradesElement => {
                                        if (gradesElement.grade == element.Grade) {
                                                gradesElement.etudiant.push(element);
                                        }
                                })
                        }
                });

        });

        return cycles;
}

function loadInscriptionData(data) {
        //load the data and put them in the needed format
        var inscriptionDate = [];
        var inscriptionData = [];

        data.forEach(element => {

                if (inscriptionDate.includes(element.Trimestre)) {
                        inscriptionData.forEach(graduationElement => {
                                if (graduationElement.date == element.Trimestre) {
                                        graduationElement.students.push(element);
                                }
                        });
                }
                else {
                        var student = [];

                        student.push(element);

                        inscriptionDate.push(element.Trimestre);
                        inscriptionData.push({ date: element.Trimestre, students: student });

                }
        });

        inscriptionData = orderResult(inscriptionData);
        return inscriptionData
}

/*****for classification factor selection*****/
function loadSelectedData(inscriptionData, filter, percent) {

        var separated = [];

        if (filter == 0) {
                inscriptionData.forEach(element => {
                        separated.push(alldata(element, percent));
                });

        }
        if (filter == 1) {//cycle , 1,2,3
                inscriptionData.forEach(element => {
                        separated.push(separatebyCycle(element, percent));
                });

        }
        if (filter == 2) { //gender  Male, Female
                inscriptionData.forEach(element => {
                        separated.push(seperatebyGender(element, percent));
                });

        }
        if (filter == 3) { //Legal Status   Canadien, Resident, Etranger
                inscriptionData.forEach(element => {
                        separated.push(seperatebyLegalStatus(element, percent));
                });

        }
        if (filter == 4) { //Study Regime   PartTime, FullTime
                inscriptionData.forEach(element => {
                        separated.push(seperatebyRegime(element, percent));
                });

        }

        return separated;

}


function orderResult(formatedData) {
        //order the data by date

        formatedData.sort(function (b, a) {
                return (b.date - a.date);
        });


        return formatedData;
}

function orderGrade(formatedData) {
        //order the data by grade

        formatedData.sort(function (b, a) {
                return (b.currentCycle - a.currentCycle);
        });


        return formatedData;
}

function alldata(inscriptionDataEntry, percent) {
        if (percent == true) {
                var data = { date: inscriptionDataEntry.date, count: 100 };
        }
        else {
                var data = { date: inscriptionDataEntry.date, count: inscriptionDataEntry.students.length };
        }

        return data;
}

function separatebyCycle(inscriptionDataEntry, percent) {
        var cycleContain = [];
        var allCycle = [];
        inscriptionDataEntry.students.forEach(element => {
                if (cycleContain.includes(element.Cycle)) {
                        allCycle.forEach(cycleElement => {
                                if (cycleElement.currentCycle == element.Cycle) {
                                        cycleElement.students.push(element);
                                }
                        });

                }
                else {
                        var student = [];

                        student.push(element);

                        cycleContain.push(element.Cycle);
                        allCycle.push({ currentCycle: element.Cycle, students: student });
                }
        });
        if (percent == true) {
                var total = allCycle[0].students.length + allCycle[1].students.length + allCycle[2].students.length;
                var data = { date: inscriptionDataEntry.date, cycle1: (allCycle[0].students.length) * 100 / total, cycle2: (allCycle[1].students.length) * 100 / total, cycle3: (allCycle[2].students.length) * 100 / total };
        }
        else {
                var data = { date: inscriptionDataEntry.date, cycle1: allCycle[0].students.length, cycle2: allCycle[1].students.length, cycle3: allCycle[2].students.length };
        }
        return data;
}



function seperatebyGender(inscriptionDataEntry, percent) {
        var genderContain = [];
        var allGender = [];
        inscriptionDataEntry.students.forEach(element => {
                if (genderContain.includes(element.Sexe)) {
                        allGender.forEach(genderElement => {
                                if (genderElement.currentGender == element.Sexe) {
                                        genderElement.students.push(element);
                                }
                        });

                }
                else {
                        var student = [];

                        student.push(element);

                        genderContain.push(element.Sexe);
                        allGender.push({ currentGender: element.Sexe, students: student });
                }
        });
        if (percent == true) {
                var total = allGender[0].students.length + allGender[1].students.length;
                var data = { date: inscriptionDataEntry.date, Male: (allGender[0].students.length) * 100 / total, Female: (allGender[1].students.length) * 100 / total };
        }
        else {
                var data = { date: inscriptionDataEntry.date, Male: allGender[0].students.length, Female: allGender[1].students.length };
        }
        return data;
}
function seperatebyLegalStatus(inscriptionDataEntry, percent) {
        var legContain = [];
        var allleg = [];
        inscriptionDataEntry.students.forEach(element => {
                if (legContain.includes(element.Statut_legal)) {
                        allleg.forEach(legElement => {
                                if (legElement.currentLeg == element.Statut_legal) {
                                        legElement.students.push(element);
                                }
                        });

                }
                else {
                        var student = [];

                        student.push(element);

                        legContain.push(element.Statut_legal);
                        allleg.push({ currentLeg: element.Statut_legal, students: student });
                }
        });
        if (percent == true) {
                var total = allleg[0].students.length + allleg[1].students.length + allleg[2].students.length;
                var data = { date: inscriptionDataEntry.date, Canadien: (allleg[0].students.length) * 100 / total, Foreign: (allleg[1].students.length) * 100 / total, Resident: (allleg[2].students.length) * 100 / total };
        }
        else {
                var data = { date: inscriptionDataEntry.date, Canadien: allleg[0].students.length, Foreign: allleg[1].students.length, Resident: allleg[2].students.length };
        }
        return data;
}

function seperatebyRegime(inscriptionDataEntry, percent) {
        var regContain = [];
        var allreg = [];
        inscriptionDataEntry.students.forEach(element => {
                if (regContain.includes(element.Regime_Etude)) {
                        allreg.forEach(regElement => {
                                if (regElement.currentReg == element.Regime_Etude) {
                                        regElement.students.push(element);
                                }
                        });

                }
                else {
                        var student = [];

                        student.push(element);

                        regContain.push(element.Regime_Etude);
                        allreg.push({ currentReg: element.Regime_Etude, students: student });
                }
        });
        if (percent == true) {
                var total = allreg[0].students.length + allreg[1].students.length;
                var data = { date: inscriptionDataEntry.date, PartTime: (allreg[0].students.length) * 100 / total, FullTime: (allreg[1].students.length) * 100 / total };
        }
        else {
                var data = { date: inscriptionDataEntry.date, PartTime: allreg[0].students.length, FullTime: allreg[1].students.length };
        }

        return data;
}

function prepareLinechartData(data) {

        var preparedData = [];

        data.forEach(element => {
                var entry = containEntry(element, preparedData);
                if (entry[0]) {
                        entry[1].count++;
                }
                else {
                        preparedData.push({ Grade: element.Grade, Programme: element.Programme, Dernier_Trim: element.Dernier_Trim, ANNEE: element.ANNEE, count: 1 });
                }
        });

        preparedData = convertYear(preparedData);

        preparedData = orderByYear(preparedData);

        return preparedData;

}

function containEntry(newEntry, preparedData) {

        var bool = false;
        var values = null;

        preparedData.forEach(element => {
                if (element.Grade == newEntry.Grade && element.Programme == newEntry.Programme && element.ANNEE == newEntry.ANNEE) {
                        bool = true;
                        values = element;
                }
        });

        return [bool, values];

}

function convertYear(preparedData) {
        preparedData.forEach(element => {
                element.ANNEE = '20' + element.ANNEE.substring(element.ANNEE.length - 2, element.ANNEE.length);
        });

        return preparedData;
}

function orderByYear(formatedData) {

        formatedData.sort(function (b, a) {
                return (b.ANNEE - a.ANNEE);
        });


        return formatedData;
}

