# Systems Development Group Project

A website that allows auction houses to manage which items they have available, and if they are sold or not.

## Requirements/Installation - Django

The project is split into two halves that build separately, this section describes what you need to do to run the backend Django website.

### Initial setup
1. Install python 3.9 or higher
2. Create a virtual environment, see [here](https://realpython.com/python-virtual-environments-a-primer/) for a guide on how to do so, and then activate it
3. Install all of the python requirements using the command `pip install -r requirements.txt`
4. Navigate inside of the /jamhouse subdirectory
5. Run the command `python manage.py migrate` and then `python manage.py runserver`

The website should now be running, and if you navigate to http://127.0.0.1:8000 you should be able to see it.

### Steps after initial setup
1. Activate your virtual environment
2. Navigate inside of the /jamhouse subdirectory
3. Check if any new database migrations need to be performed by running `python manage.py migrate`
4. Run the server using the command `python manage.py runserver`

## Requirements/Installation - React

tbc
