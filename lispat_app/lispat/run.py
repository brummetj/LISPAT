import sys
import nltk
import docopt
from lispat.utils.logger import Logger
from lispat.utils.colors import bcolors
from lispat.base.manager import CommandManager

logger = Logger("Main")
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')


def app_main(args, manager):
    """
    Summary: Main function handles arguments and hands them off to the manager.
    param: args: arguments for function calls
    :return: exit code
    """
    try:
        #manager = CommandManager()
        if args['convert'] and args['--docA'] and args['--docB']:
            docA_path = args['--docA']
            docB_path = args['--docB']
            manager.create_path(docA_path, docB_path)
            return manager.convert()

        if args['filter']:
            manager.filter()

        if args['data']:
            data = manager.get_json()
            return data

        if args['analytics'] and args['--path']:
            user_path = args['--path']
            manager.create_path(user_path)
            manager.run_analytics(args)

        if args['compare'] and args['--standard'] and args['--submission']:
            std_path = args['--standard']
            sub_path = args['--submission']

            manager.create_path(std_path, sub_path)

            html_file = manager.run_sub_vs_std(args)
            #return html_file

        if args['compare'] and args['input'] and args['--standard']:
            print(args['--text'])
            std_path = args['--standard']
            print(std_path)
            manager.create_path(std_path)
            manager.run_sub_vs_txt(args)

        if args['clean']:
            manager.clean()

    except KeyboardInterrupt:
        logger.getLogger().error(bcolors.FAIL + "Keyboard interrupt. Exiting"
                                 + bcolors.ENDC)
        sys.exit(1)


if __name__ == '__main__':
    app_main(sys.argv)
