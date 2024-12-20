import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim() !== '') {
      navigate(`/search/${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/store');
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        onChange={handleInputChange}
        value={keyword}
        placeholder='Tìm kiếm sản phẩm...'
        className='mr-sm-2 ml-sm-5'
        style={{width: '450px'}}
      ></Form.Control>
      <Button type='submit' className='py-2 px-3 mx-1 input-group-text'>
        <BsSearch className='text-white' />
      </Button>
    </Form>
  );
};

export default SearchBox;
