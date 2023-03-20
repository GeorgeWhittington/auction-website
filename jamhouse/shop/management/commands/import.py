from django.core.management.base import BaseCommand, CommandError, CommandParser
from shop.models import Item, Set, Repository

ITEM_CSV_NAME = 'Online Store Project Items for Sale.csv'
ITEM_CSV_SET_NAME = 'Online Store Project Sets of Items for Sale.csv'
ITEM_REPOSITORIES = [
    {"name" : "SHOP A", 'filepath' : 'Online Store Project Items for Sale ALTERNATIVE SHOP A.csv'},
    {"name" : "SHOP B", 'filepath' : 'Online Store Project Items for Sale ALTERNATIVE SHOP B.csv'},
]

class Command(BaseCommand):
    help = 'Imports a CSV file of items into the database'

    def import_items(self, filepath):
        print("Importing items from:", filepath)

        self.items = {}

        with open(filepath, 'r') as f:
            for line in f.readlines():
                splits = line.split(',')

                # make sure line is valid item
                if splits[0].isdigit():
                    id      = int(splits[0])
                    desc    = splits[1]
                    price   = float(splits[2])

                    new_item = Item()
                    new_item.description = desc
                    new_item.price = price
                    new_item.save()

                    self.items[id] = new_item

        print(len(self.items), 'Items Imported\n')

    def import_sets(self, filepath):
        print('Importing Sets: ', filepath)

        with open(filepath, 'r') as f:
            for line in f.readlines():
                splits = line.split(',')

                if splits[0].isdigit():

                    set_desc        = splits[1]
                    set_price       = splits[2]
                    set_num_items   = int(splits[3])
                    set_items = []

                    for i in range(set_num_items):
                        id = 4 + i
                        if splits[id].isdigit():
                            set_items.append(int(splits[id]))

                    # Create set
                    new_set = Set()
                    new_set.description = set_desc
                    new_set.price = set_price
                    new_set.save()

                    for id in set_items:
                        item = self.items[id]

                        if item != None:
                            print(f"Adding '{item.description}' to set '{new_set.description}'")
                            item.sets.add(new_set)
                            item.save()
                            
                    print(new_set.items.count(), 'Items added to set')

    def import_repository(self, repo_name, filepath):
        print('\nImporting Repository: ', filepath)

        with open(filepath, 'r') as f:

            # Create a new repository for this file
            repo = Repository()
            repo.name = repo_name
            repo.save()

            for line in f.readlines():
                splits = line.split(',')
                if splits[0].isdigit():
                    item = self.items[int(splits[0])]

                    if item != None:
                        print(f"Adding '{item}' to repository '{repo.name}'")
                        item.repositories.add(repo)
                        item.save()

            print(repo.items.count(), 'Items added to repository')
                        
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument('directory')

    def handle(self, *args, **options):
        directory = options['directory']

        # Remove existing items, repositories and sets
        Item.objects.all().delete()
        Repository.objects.all().delete()
        Set.objects.all().delete()
        
        # Process items
        self.import_items(f'{directory}\{ITEM_CSV_NAME}')

        # Process Sets
        self.import_sets(f'{directory}\{ITEM_CSV_SET_NAME}')

        # Process Repositories
        for repo in ITEM_REPOSITORIES:
            self.import_repository(repo['name'], f"{directory}\{repo['filepath']}")

        