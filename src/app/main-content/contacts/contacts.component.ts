import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Contact } from '../../shared/interfaces/contact.interface';

@Component({
  selector: 'join-contacts',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent, ButtonComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  dummyContacts: Contact[] = [
    {
      name: 'Elizabeth Bennet',
      email: 'pemberley@derbyshire.com',
      phone: '07453-1249743',
      color: '#ffa500'
    },
    {
      name: 'Effi Briest',
      email: 'von_innstetten@kessin.com',
      phone: '125084-1947304',
      color: '#1e90ff'
    },
    {
      name: 'Jay Gatsby',
      email: 'gatsby@westegg.com',
      phone: '04523-7820345',
      color: '#32cd32'
    },
    {
      name: 'Anna Karenina',
      email: 'anna.karenina@moscow.com',
      phone: '01784-2049356',
      color: '#ff4500'
    },
    {
      name: 'Humbert Humbert',
      email: 'hh@ladylolita.com',
      phone: '03457-9812534',
      color: '#8a2be2'
    },
    {
      name: 'Emma Woodhouse',
      email: 'emma@hartfield.com',
      phone: '05592-6738294',
      color: '#ff69b4'
    },
    {
      name: 'Fanny Price',
      email: 'mansfield@mansfieldpark.com',
      phone: '04875-3382914',
      color: '#20b2aa'
    },
    {
      name: 'Dorian Gray',
      email: 'dorian@pictureofgray.com',
      phone: '05674-9823347',
      color: '#dda0dd'
    },
    {
      name: 'Charles Bovary',
      email: 'cbovary@normandy.com',
      phone: '04297-5628304',
      color: '#ff6347'
    },
    {
      name: 'Scarlett O\'Hara',
      email: 'scarlett@tara.com',
      phone: '06348-7328472',
      color: '#4682b4'
    },
    {
      name: 'Rhett Butler',
      email: 'rhett@notgivingadam.com',
      phone: '05384-9817643',
      color: '#7fff00'
    },
    {
      name: 'Hester Prynne',
      email: 'hester@thescarletletter.com',
      phone: '03184-5629874',
      color: '#dc143c'
    },
    {
      name: 'Jean Valjean',
      email: 'jvaljean@lesmis.com',
      phone: '02483-9847653',
      color: '#b8860b'
    },
    {
      name: 'Elizabeth Lavenza',
      email: 'elizabeth@frankenstein.com',
      phone: '03984-8756349',
      color: '#9400d3'
    },
    {
      name: 'Tom Buchanan',
      email: 'tom@eastEgg.com',
      phone: '06475-7839201',
      color: '#00ff7f'
    },
    {
      name: 'Catherine Earnshaw',
      email: 'catherine@wutheringheights.com',
      phone: '04267-3947528',
      color: '#ff1493'
    },
    {
      name: 'Gregory Samsa',
      email: 'gsamsa@themetamorphosis.com',
      phone: '02756-8236459',
      color: '#ff7f50'
    },
    {
      name: 'Clarissa Dalloway',
      email: 'clarissa@dalloway.com',
      phone: '05923-8723654',
      color: '#7b68ee'
    },
    {
      name: 'Pip Pirrip',
      email: 'pip@greatexpectations.com',
      phone: '03568-8723456',
      color: '#48d1cc'
    },
    {
      name: 'Atticus Finch',
      email: 'atticus@maycomb.com',
      phone: '04756-9837456',
      color: '#f08080'
    }
  ];

  
  groupedContacts: { key: string; value: Contact[] }[] = [];

  
  ngOnInit(): void {
    this.groupContacts();
  }


  groupContacts(): void {
    const groups = this.dummyContacts.reduce((acc, contact) => {
      const lastNameInitial = contact.name.split(' ').pop()?.charAt(0).toUpperCase() ?? '';
      if (!acc[lastNameInitial]) {
        acc[lastNameInitial] = [];
      }
      acc[lastNameInitial].push(contact);
      return acc;
    }, {} as { [key: string]: Contact[] });

    // Optional: Sortiere die Buchstaben
    this.groupedContacts = Object.keys(groups)
      .sort()
      .map(key => ({ key, value: groups[key] }));
  }
    

}
