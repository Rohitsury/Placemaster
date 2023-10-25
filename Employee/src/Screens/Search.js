import React, { useState, useEffect } from 'react';
import Navbar from '../Component/Navbar';

function Search() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cgpa, setCgpa] = useState('');
    const [selectedbranch, setSelectedbranch] = useState('all');

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await fetch('http://localhost:5000/employee/studentData');
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            console.log(err);
        }
    };

    

    const filteredStudents = students.filter((student) => {
        const hasSelectedbranch =
            selectedbranch === 'all' || student.branch === selectedbranch;

        if (!searchTerm && !cgpa) {
            return hasSelectedbranch;
        }

        const searchSkills = searchTerm.toLowerCase().split('');

        const hasSkills = searchSkills.every((skill) =>
            student.skills.toLowerCase().includes(skill)
        );

        const hasCGPA = cgpa ? student.cgpa >= parseFloat(cgpa) : true;

        return hasSelectedbranch && hasSkills && hasCGPA;
    });


    return (
        <>
            <Navbar />
            <section> 
                <section className='mt-4 mb-4 text-white'>
                    <div className='container'>
                        <form id='search-form'>
                            <label htmlFor='search-input' className='me-2'>
                                Enter skills
                            </label>
                            <input
                                type='text'
                                id='search-input'
                                name='search'
                                placeholder='Enter search term...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <label htmlFor='category-select' className='me-2 ms-4'>
                                Select Department
                            </label>
                            <select
                                id='category-select'
                                name='category'
                                value={selectedbranch}
                                onChange={(e) => setSelectedbranch(e.target.value)}
                            >
                                <option value='all'>All</option>
                                <option value='Computer Science Engineering'>CSE</option>
                                <option value='Electrical and Electronics Engineering'>EE</option>
                                <option value='Electrical and communication Engineering'>EC</option>
                                <option value='Mechanical Engineer'>Mechanical Engineer</option>
                                <option value='Master Of Technology'>MTech</option>
                                <option value='Master Of Computer Application'>MCA</option>
                                <option value='Master Of Business Administration'>MBA</option>
                            </select>

                            <label htmlFor='cgpa-input' className='me-2 ms-4'>
                                Enter CGPA
                            </label>
                            <input
                                type='text'
                                id='cgpa-input'
                                name='cgpa'
                                placeholder='Enter CGPA...'
                                value={cgpa}
                                onChange={(e) => setCgpa(e.target.value)}
                            />
                        </form>
                    </div>
                </section>

                <section className='text-white shadow'>
                    <div className='container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th></th>
                                    <th>Student Name</th>
                                    <th>Student Email</th>
                                    <th>Department</th>
                                    <th>Skills</th>
                                    <th>CGPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                           <img src={student.profileimg} alt={student.name} />
                                        </td>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.branch}</td>
                                        <td>{student.skills}</td>
                                        <td>{student.cgpa}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </section>

            <style>{`
        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        td img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        @media screen and (max-width: 600px) {
          table {
            border: 1px solid #ccc;
          }
          th, td {
            display: block;
            width: 100%;
          }
          th {
            text-align: center;
          }
        }
      `}</style>
        </>
    );
}

export default Search;
