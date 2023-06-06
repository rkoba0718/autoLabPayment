import React from 'react';
import {login} from '../lib/authtest';

const TestUserFirebase = () => {
  login();
  return <div className="bg-black text-white">
    login test. please check the console.
  </div>
}

export default TestUserFirebase