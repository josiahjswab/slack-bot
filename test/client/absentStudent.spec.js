import React from 'react';
import AbsentStudent from '../../client/src/js/components/ConfirmAbsentees/AbsentStundent';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

let student = {
  absent: true,
  github_id: "",
  id: 5,
  name: "David Warren",
  slack_id: "05201987",
  wakatime_key: ""
};

describe('abstentee button', () => {
  it('should have a button', () => {
    const app = shallow(<AbsentStudent key={5} student={student} />);
    expect(toJson(app)).toMatchSnapshot();
  });
});
