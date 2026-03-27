# TODO List

## High Propriety

- [ ] Display the eligibility of a BSc., BSc. (unclassified/pass degree), GradDip., GradCert., Diploma of Higher Education, and Certificate of Higher Education
- [ ] Save progress
- [ ] Create a `Degree` class that takes in a degree and validates it and its related information and (maybe) connects it with other information

## Medium Propriety

- [ ] Disable RPL status options for modules that cannot be RPE'd, such as Final Project
	- When setting the global or local status to RPL, do not change the status of the modules that cannot be RPL'd.
- [ ] Add versioning page
- [ ] Make a JSON schema for the degrees
- [ ] Add meta tags for the website

## Low Propriety

- [ ] Keep the grades of the choose type modules and the normal modules when switching between degrees
	- This will require moving the creating of the choose type modules from `ChooseRequiredModule` to `ModuleTables` so that each row can have a key that corresponds to the selected module
- [ ] Ability to share grade results via URL
	- Just add a URL parameter
- [ ] Fix "A form field element should have an id or name attribute" for all `<select>` and `<input>` elements

## Not sure...

- [ ] Reset/Empty button
- [ ] Split the types of degrees (BSc., GradDip., etc.) from each other
