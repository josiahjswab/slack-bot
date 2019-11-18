import React from 'react';
import Delinquents from '../client/src/js/components/Delinquents';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

let students = [{
  absent: true,
  github_id: "",
  id: 5,
  name: "David Warren",
  slack_id: "05201987",
  wakatime_key: ""
}];

describe('Delinquents', () => {
  it('should have a list', () => {
    const app = shallow(<Delinquents students={students} />);
    expect(toJson(app)).toMatchSnapshot();
  });
});
