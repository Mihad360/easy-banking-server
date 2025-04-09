export const calculateGradeAndPoints = (totalMarks: number) => {
  let result = {
    grade: "NA",
    gradePoints: 0,
  };

  if (totalMarks >= 0 && totalMarks < 20) {
    result = {
      grade: "F",
      gradePoints: 2.0,
    };
  } else if (totalMarks >= 20 && totalMarks < 40) {
    result = {
      grade: "D",
      gradePoints: 2.5,
    };
  } else if (totalMarks >= 40 && totalMarks < 60) {
    result = {
      grade: "C",
      gradePoints: 3.0,
    };
  } else if (totalMarks >= 60 && totalMarks < 80) {
    result = {
      grade: "B",
      gradePoints: 3.5,
    };
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    result = {
      grade: "A",
      gradePoints: 4.0,
    };
  }
  // else {
  //   result = {
  //     grade: "NA",
  //     gradePoints: 0,
  //   };
  // }
  return result;
};
