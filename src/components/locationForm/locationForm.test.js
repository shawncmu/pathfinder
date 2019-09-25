import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LocationForm from './index.js';

Enzyme.configure({ adapter: new Adapter() });

describe('LocationForm', function() {

	it('Should capture starting point correctly onChange and change the state accordingly', function() {
	  const component = mount(<LocationForm />);
	  const input = component.find('Input').at(0);
	  input.instance().value = 'central';
	  input.simulate('change');
	  expect(component.state().origin).toEqual('central');
	});

	it('Should remove starting point onClear and change the state accordingly', function() {
	  const component = mount(<LocationForm />);
	  const button = component.find('.clear').at(0);
	  button.simulate('click');
	  expect(component.state().origin).toEqual('');
	});

	it('Should capture drop off point correctly onChange and change the state accordingly', function() {
	  const component = mount(<LocationForm />);
	  const input = component.find('Input').at(1);
	  input.instance().value = 'admiralty';
	  input.simulate('change');
	  expect(component.state().destination).toEqual('admiralty');
	});

	it('Should remove starting point onClear and change the state accordingly', function() {
	  const component = mount(<LocationForm />);
	  const button = component.find('.clear').at(1);
	  button.simulate('click');
	  expect(component.state().destination).toEqual('');
	});

  it('Should capture radio button switched correctly onChange', function() {
    const component = mount(<LocationForm />);
    const input = component.find('[name="walk"]');
    input.instance().value = 'walk';
    input.simulate('change');
    expect(component.state().method).toEqual('drive');
  })

 	it('Should update waypoints, total distance and total time in state on successful submission', function() {
		const component = mount(<LocationForm />);
    const button = component.find('[name="submit"]');
    const inputStart = component.find('Input').at(0);
	  inputStart.instance().value = 'central';
    const inputDestination = component.find('Input').at(1);
	  inputDestination.instance().value = 'admiralty';
    button.simulate('click');
    expect(component.state().waypoints).not.toBe(null);
    expect(component.state().totalDistance).not.toBe(null);
    expect(component.state().totalTime).not.toBe(null);
	});

 	it('Should update submit button content on submit', function() {
 		const component = mount(<LocationForm />);
    const button = component.find('[name="submit"]');
    expect(button.innerHTML).toBe('Submit');
    button.simulate('click');
    expect(button.innerHTML).toBe("Re-submit");
	});

 	it('Should reset all data onClick reset', function() {
 		const component = mount(<LocationForm />);
    const resetButton = component.find('[name="reset"]');
    const submitButton = component.find('[name="submit"]');
    resetButton.simulate('click');
    expect(component.state().waypoints).toBe(null);
    expect(component.state().totalDistance).toBe(null);
    expect(component.state().totalTime).toBe(null);
    expect(component.state().origin).toEqual('');
    expect(component.state().destination).toEqual('');
    expect(submitButton.innerHTML).toBe("Submit");
	});

 	it('Should display errors on failed submission', function() {
	});

});