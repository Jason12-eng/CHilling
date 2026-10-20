
$(function () {

   
    // Student Data
  

    var students = [
        {
            id: 1,
            name: 'Kan Marady',
            sex: 'F',
            phone: '093857688',
            dob: '2000-01-01',
            email: 'test@gmail.com'
        },
        {
            id: 2,
            name: 'Siv Meymey',
            sex: 'F',
            phone: '093857688',
            dob: '2000-01-30',
            email: 'test2@gmail.com'
        },
        {
            id: 3,
            name: 'Sivguy Te',
            sex: 'M',
            phone: '093857688',
            dob: '2001-01-01',
            email: 'test1@gmail.com'
        }
    ];

    var nextId = 4;
    var editingId = null;



    // date Functions
    

    function fmtDate(iso) {
        var parts = iso.split('-');

        return parts[2] + '-' + parts[1] + '-' + parts[0];
    
    }

    



    function parseDisplayDate(displayDate) {
        var match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(displayDate);

        if (!match) {
            return null;
        }

        var day = Number(match[1]);
        var month = Number(match[2]);
        var year = Number(match[3]);
        var daysInMonth = [
            31,
            year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
            31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ][month - 1];

        if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth) {
            return null;
        }

        return match[3] + '-' + match[2] + '-' + match[1];
    }

    function todayISO() {
        var today = new Date();
        var month = String(today.getMonth() + 1);
        var day = String(today.getDate());

        if (month.length === 1) month = '0' + month;
        if (day.length === 1) day = '0' + day;

        return today.getFullYear() + '-' + month + '-' + day;
    }


    function esc(value) {
        return $('<div>')
            .text(value)
            .html();
    }

     //  cleans the student's name.

    function sanitizeName(value) {
        var name = value
            .replace(/[^A-Za-z ]/g, '')
            .replace(/^\s+/, '')
            .replace(/ {2,}/g, ' ');
        var firstSpace = name.indexOf(' ');

        if (firstSpace !== -1) {
            name = name.slice(0, firstSpace + 1) +
                name.slice(firstSpace + 1).replace(/ /g, '');
        }

        return name.charAt(0).toUpperCase() + name.slice(1);
    }


    // Render Table Take the data from the students array and display it in the HTML table.
  

    function render() {

        var $tbody = $('#tbody').empty();

        if (!students.length) {

            $tbody.append(
                '<tr>' +
                    '<td colspan="7" class="empty">' +
                        'No students yet. Click Add New to create one.' +
                    '</td>' +
                '</tr>'
            );
        }

        $.each(students, function (_, student) {

            $tbody.append(
                '<tr data-id="' + student.id + '">' +

                    '<td>' +
                        '<input ' +
                            'type="checkbox" ' +
                            'class="rowCheck" ' +
                            'aria-label="Select ' +
                            esc(student.name) +
                            '">' +
                    '</td>' +

                    '<td>' + student.id + '</td>' +

                    '<td>' + esc(student.name) + '</td>' +

                    '<td>' + student.sex + '</td>' +

                    '<td>' + esc(student.phone) + '</td>' +

                    '<td>' + fmtDate(student.dob) + '</td>' +

                    '<td>' + esc(student.email) + '</td>' +

                '</tr>'
            );
        });

        $('#checkAll').prop('checked', false);

        updateButtons();
    }



    // Selected Students
 

    function selectedIds() {

        return $('.rowCheck:checked')
            .map(function () {

                return +$(this)
                    .closest('tr')
                    .data('id');

            })
            .get();
    }



    // Update Buttons


    function updateButtons() {

        var count = selectedIds().length;

        // Edit requires exactly one student
        $('#btnEdit').prop(
            'disabled',
            count !== 1
        );

        // Remove requires at least one student
        $('#btnRemove').prop(
            'disabled',
            count === 0
        );

        // Highlight selected rows
        $('.rowCheck').each(function () {

            $(this)
                .closest('tr')
                .toggleClass(
                    'selected',
                    this.checked
                );
        });
    }


    // Select All


    $('#checkAll').on('change', function () {

        $('.rowCheck').prop(
            'checked',
            this.checked
        );

        updateButtons();
    });


    // Individual Selection


    $('#tbody').on(
        'change',
        '.rowCheck',
        function () {

            var allSelected =
                $('.rowCheck').length ===
                $('.rowCheck:checked').length;

            $('#checkAll').prop(
                'checked',
                allSelected
            );

            updateButtons();
        }
    );



    // Add / Edit Modal
 

    function openForm(student) {

        editingId = student
            ? student.id
            : null;

        $('#modalTitle').text(
            student
                ? 'Edit student'
                : 'Add student'
        );

        $('#fName').val(
            student
                ? student.name
                : ''
        );

        $('#fSex').val(
            student
                ? student.sex
                : ''
        );

        $('#fPhone').val(
            student
                ? student.phone
                : ''
        );

        $('#fDob').val(
            student
                ? fmtDate(student.dob)
                : ''
        );

        $('#fEmail').val(
            student
                ? student.email
                : ''
        );

        // Clear previous errors
        $('.err').text('');

        // Hide duplicate warning
        $('#dupAlert').hide();

        // Open modal
        $('#formModal').addClass('open');

        // Focus name input
        $('#fName').trigger('focus');
    }


    function closeForm() {

        $('#formModal')
            .removeClass('open');
    }



    // Input Restrictions
   

    // Capitalize the first letter and allow only letters and one space.
    $('#fName').on('input', function () {
        var cursor = this.selectionStart;
        var name = this.value;
        var cleanedName = sanitizeName(name);

        if (name !== cleanedName) {
            this.value = cleanedName;
            this.setSelectionRange(
                sanitizeName(name.slice(0, cursor)).length,
                sanitizeName(name.slice(0, cursor)).length
            );
        }
    });

    // Remove spaces and all non-digit characters from phone numbers.
    $('#fPhone').on('input', function () {
        var cursor = this.selectionStart;
        var phone = this.value;
        var digits = phone.replace(/\D/g, '');

        if (phone !== digits) {
            this.value = digits;
            var digitCursor = phone.slice(0, cursor).replace(/\D/g, '').length;
            this.setSelectionRange(digitCursor, digitCursor);
        }
    });

    // Format date input as DD-MM-YYYY while typing.
    $('#fDob').on('input', function () {
        var cursor = this.selectionStart;
        var dateText = this.value;
        var digitsBeforeCursor = dateText.slice(0, cursor).replace(/\D/g, '').length;
        var digits = dateText.replace(/\D/g, '').slice(0, 8);
        var formatted = digits.slice(0, 2);

        if (digits.length > 2) {
            formatted += '-' + digits.slice(2, 4);
        }
        if (digits.length > 4) {
            formatted += '-' + digits.slice(4);
        }

        this.value = formatted;

        var newCursor = digitsBeforeCursor;
        if (digitsBeforeCursor > 2) newCursor++;
        if (digitsBeforeCursor > 4) newCursor++;
        this.setSelectionRange(newCursor, newCursor);
    });

    // Add Button
    

    $('#btnAdd').on('click', function () {

        openForm(null);
    });



    // Edit Button


    $('#btnEdit').on('click', function () {

        var id = selectedIds()[0];

        var student = students.filter(
            function (student) {
                return student.id === id;
            }
        )[0];

        openForm(student);
    });


    // Cancel Button


    $('#btnCancel').on(
        'click',
        closeForm
    );


    // Validation
   

    function setErr(field, message) {

        $('.err[data-for="' + field + '"]')
            .text(message);

        return !message;
    }


    function validate(data) {

        // Clear previous errors
        $('.err').text('');

        $('#dupAlert').hide();

        var valid = true;


        // Full Name
        valid =
            setErr(
                'fName',
                !data.name
                    ? 'Enter the full name.'
                    : /^[A-Z][A-Za-z]*(?: [A-Za-z]+)?$/.test(data.name)
                        ? ''
                        : 'Start with a capital letter and use no more than one space.'
            ) && valid;


        // Sex
        valid =
            setErr(
                'fSex',
                data.sex
                    ? ''
                    : 'Choose M or F.'
            ) && valid;


        // Phone
        valid =
            setErr(
                'fPhone',
                /^[0-9]{8,15}$/.test(data.phone)
                    ? ''
                    : 'Enter 8 to 15 digits without spaces.'
            ) && valid;


        // Date of Birth
        var dobISO = parseDisplayDate(data.dob);
        var dobError = !dobISO
            ? 'Enter a valid date as DD-MM-YYYY.'
            : dobISO > todayISO()
                ? 'Date of birth cannot be in the future.'
                : '';

        valid =
            setErr(
                'fDob',
                dobError
            ) && valid;


        // Email
        valid =
            setErr(
                'fEmail',
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
                    ? ''
                    : 'Enter a valid email address.'
            ) && valid;


        return valid;
    }



    // Find Duplicate Student

    /*
        Duplicate rules:

        1. Same email
        2. Same full name + date of birth

        The student currently being edited
        is ignored.
    */

    function findDuplicate(data) {

        var normalizedName = data.name
            .toLowerCase()
            .replace(/\s+/g, ' ');


        for (var i = 0; i < students.length; i++) {

            var student = students[i];


            // Ignore the student being edited
            if (student.id === editingId) {
                continue;
            }


            // Check duplicate email
            if (
                student.email.toLowerCase() ===
                data.email.toLowerCase()
            ) {

                return (
                    'A student with the email ' +
                    data.email +
                    ' already exists.'
                );
            }


            // Check duplicate name + date of birth
            var studentName = student.name
                .toLowerCase()
                .replace(/\s+/g, ' ');

            if (
                studentName === normalizedName &&
                student.dob === data.dob
            ) {

                return (
                    'A student named ' +
                    data.name +
                    ' with this date of birth already exists.'
                );
            }
        }


        return null;
    }


  
    // Save Student


    $('#btnSave').on('click', function () {

        var data = {

            name: $.trim(
                $('#fName').val()
            ).replace(/\s+/g, ' '),

            sex: $('#fSex').val(),

            phone: $.trim(
                $('#fPhone').val()
            ),

            dob: $('#fDob').val(),

            email: $.trim(
                $('#fEmail').val()
            )
        };


        // Validate form
        if (!validate(data)) {
            return;
        }

        data.dob = parseDisplayDate(data.dob);


        // Check for duplicates
        var duplicate = findDuplicate(data);

        if (duplicate) {

            $('#dupAlert')
                .text(duplicate)
                .show();

            return;
        }


  
        // Add New Student
   

        if (editingId === null) {

            data.id = nextId++;

            students.push(data);
        }



        // Update Existing Student
       

        else {

            $.each(
                students,
                function (index, student) {

                    if (student.id === editingId) {

                        data.id = student.id;

                        students[index] = data;
                    }
                }
            );
        }


        // Close modal
        closeForm();

        // Refresh table
        render();
    });


    // =========================
    // Remove Students
    // =========================

    $('#btnRemove').on('click', function () {

        var count = selectedIds().length;

        var message =
            'Remove ' +
            count +
            (count === 1
                ? ' student'
                : ' students') +
            ' from the table? This cannot be undone.';

        $('#delText').text(message);

        $('#delModal').addClass('open');
    });


    // =========================
    // Cancel Remove
    // =========================

    $('#delCancel').on('click', function () {

        $('#delModal')
            .removeClass('open');
    });


    // =========================
    // Confirm Remove
    // =========================

    $('#delConfirm').on('click', function () {

        var ids = selectedIds();

        students = students.filter(
            function (student) {

                return ids.indexOf(student.id) === -1;
            }
        );

        $('#delModal')
            .removeClass('open');

        render();
    });


    // =========================
    // Keyboard Shortcuts
    // =========================

    $(document).on('keydown', function (e) {

        // Escape → close modals
        if (e.key === 'Escape') {

            closeForm();

            $('#delModal')
                .removeClass('open');
        }


        // Enter → save form
        if (
            e.key === 'Enter' &&
            $('#formModal').hasClass('open') &&
            e.target.tagName !== 'BUTTON'
        ) {

            $('#btnSave').trigger('click');
        }
    });


    // =========================
    // Initial Render
    // =========================

    render();

});
