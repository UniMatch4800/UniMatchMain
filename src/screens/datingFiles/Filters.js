import React, { useState, useEffect } from 'react';
import './Filters.css';
import Select from 'react-select';

const Filters = ({ applyFilters }) => {
  const [ageFilter, setAgeFilter] = useState('');
  // const [campusFilter, setCampusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [graduationYearFilter, setGraduationYearFilter] = useState('');
  // const [hobbiesFilter, setHobbiesFilter] = useState('');
  // const [majorFilter, setMajorFilter] = useState('');
  // const [raceFilter, setRaceFilter] = useState([]);

  useEffect(() => {
    // Apply filters when any of the filter options change
    applyFilters({
      age: ageFilter,
      // campus: campusFilter,
      gender: genderFilter,
      graduationYear: graduationYearFilter,
      // hobbies: hobbiesFilter,
      // major: majorFilter,
      // race: raceFilter,
    });
  }, [
    ageFilter,
    // campusFilter,
    genderFilter,
    graduationYearFilter,
    // hobbiesFilter,
    // majorFilter,
    // raceFilter,
  ]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#222",
      color: "white",
      border: state.isFocused ? "1px solid #faa805" : "1px solid white",
      boxShadow: 'none',
      borderRadius: "10px",
      "&:hover": {
        borderColor: "1px solid #faa805",
      },
      width: '180px',
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "#222",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "white",
      backgroundColor: state.isSelected ? "#faa805" : "#222",
      "&:hover": {
        backgroundColor: "#faa805",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#faa805" : "white",
    }),
  };
    
  return (
    <div className="filter-fields">
      <Select
        className="select-box"
        value={ageFilter}
        onChange={(selectedOption) => setAgeFilter(selectedOption)}
        options={[
          { value: '', label: 'Any' },
          { value: '18-20', label: '18-20' },
          { value: '21-23', label: '21-23' },
          { value: '24-26', label: '24-26' },
          { value: '27-29', label: '27-29' },
          { value: '30+', label: '30+' },
        ]}
        placeholder="Age"
        menuPortalTarget={document.body}
        styles={customStyles}
      />

      {/* <Select
        className="select-box"
        value={campusFilter}
        onChange={(selectedOption) => setCampusFilter(selectedOption)}
        options={[
          { value: '', label: 'Any' },
          { value: 'CPP', label: 'CPP' },
          { value: 'Other Campus', label: 'Other Campus' },
        ]}
        placeholder="Campus"
        menuPortalTarget={document.body}
        styles={customStyles}
      /> */}

      <Select
        className="select-box"
        value={genderFilter}
        onChange={(selectedOption) => setGenderFilter(selectedOption)}
        options={[
          { value: '', label: 'Any' },
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Other', label: 'Other' },
        ]}
        placeholder="Gender"
        menuPortalTarget={document.body}
        styles={customStyles}
      />

      <Select
        className="select-box"
        value={graduationYearFilter}
        onChange={(selectedOption) => setGraduationYearFilter(selectedOption)}
        options={[
          { value: '', label: 'Any' },
          { value: '2023', label: '2023' },
          { value: '2024', label: '2024' },
          { value: '2025', label: '2025' },
          { value: '2026', label: '2026' },
          { value: '2027', label: '2027' },
          { value: '2028', label: '2028' },

        ]}
        placeholder="Graduation Year"
        menuPortalTarget={document.body}
        styles={customStyles}
      />

      {/* <Select
        className="select-box"
        value={hobbiesFilter}
        onChange={(selectedOption) => setHobbiesFilter(selectedOption)}
        options={[
          { value: '', label: 'Hobbies' },
          { value: 'Hobby 1', label: 'Hobby 1' },
          { value: 'Hobby 2', label: 'Hobby 2' },
          // Add more options as needed
        ]}
        placeholder="Hobbies"
        menuPortalTarget={document.body}
        styles={customStyles}
      /> */}

      {/* <Select
        className="select-box"
        value={majorFilter}
        onChange={(selectedOption) => setMajorFilter(selectedOption)}
        options={[
          { value: '', label: 'Major' },
          { value: 'CS', label: 'CS' },
          { value: 'Major 2', label: 'Major 2' },
          // Add more options as needed
        ]}
        placeholder="Major"
        menuPortalTarget={document.body}
        styles={customStyles}
      /> */}

      {/* <Select
        className="select-box"
        value={raceFilter}
        onChange={(selectedOption) => setRaceFilter(selectedOption)}
        options={[
          { value: '', label: 'Any' },
          { value: 'Caucasian', label: 'Caucasian' },
          { value: 'African American', label: 'African American' },
          { value: 'Hispanic', label: 'Hispanic' },
          { value: 'Asian', label: 'Asian' },
        ]}
        placeholder="Race"
        menuPortalTarget={document.body}
        styles={customStyles}
        isMulti
      /> */}
    </div>
  );
};

export default Filters;
