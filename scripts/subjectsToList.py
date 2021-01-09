rawSubjects = []
with open('subjects.txt') as f:
    rawSubjects = f.readlines()

arr = []
subjects = {}

for i,subject in enumerate(rawSubjects):
    subjects[i+1] = subject.strip()
    print(i,subject.strip())

print(subjects)

