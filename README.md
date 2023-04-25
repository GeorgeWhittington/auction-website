# Systems Development Group Project

A website that allows auction houses to manage which items they have available, and if they are sold or not.

## Requirements/Installation - Django

The project is split into two halves that build separately, this section describes what you need to do to run the backend Django website. The admin user for the example database that is included has the username "admin" and the password "password".

### Running Django Server

1. Install python 3.9 or higher
2. Create a virtual environment, see [here](https://realpython.com/python-virtual-environments-a-primer/) for a guide on how to do so, and then activate it
3. Navigate inside of the /jamhouse subdirectory
3. Install all of the python requirements using the command `pip install -r requirements.txt`
5. Run the command `python manage.py migrate` and then `python manage.py runserver`

The website should now be running, and if you navigate to http://127.0.0.1:8000 you should be able to see it.

## Running React Project

1. Install the node package manager, see [here](https://kinsta.com/blog/how-to-install-node-js/) for a guide
2. Open your terminal and navigate into the `jamhouse-react` folder
3. Run the command `npm install` to install the requirements for this project
4. Now run `npm start` to run the node server

The react website should now be running at http://localhost:3000/ - usually npm automatically opens your web browser.